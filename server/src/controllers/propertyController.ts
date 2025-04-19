import { Request, Response } from "express";
import { PrismaClient, Prisma, PropertyType } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'
import { Location } from "@prisma/client";
import axios from "axios"

const prisma = new PrismaClient();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,

})

export const getProperties = async(req: Request, res: Response): Promise<void> => {
    try{
        const {favoritesID,priceMin, priceMax, beds, baths, propertyType, squareFeetMin,squareFeetMax,amenities,availableFrom,latitude,longitude} = req.query;
        let whereCondition: Prisma.Sql[] = []

        if(favoritesID){
            const favoritesIdsArray = (favoritesID as string ).split(",").map(Number);
            whereCondition.push(Prisma.sql`p.id IN (${Prisma.join(favoritesIdsArray)})`)
        }
        
        if(priceMin){
            whereCondition.push(Prisma.sql`p."PricePerMonth" >= ${Number({priceMin})}`)
        }
        
        if(priceMax){
            whereCondition.push(Prisma.sql`p."PricePerMonth" <= ${Number({priceMax})}`)
        }

        if(beds && beds !== "any"){
            whereCondition.push(Prisma.sql`p.beds >= ${Number(beds)}`)
        }
        
        if(baths && baths !== "any"){
            whereCondition.push(Prisma.sql`p.baths >= ${Number(baths)}`)
        }

        if(propertyType && propertyType  !== "any"){
            whereCondition.push(Prisma.sql`p.propertyType = ${propertyType}:: "PropertyType"`)
        }

        if(squareFeetMin){
            whereCondition.push(Prisma.sql`p."squareFeetMin" >= ${Number({squareFeetMin})}`)
        }
        
        if(squareFeetMax){
            whereCondition.push(Prisma.sql`p."squareFeetMax" <= ${Number({squareFeetMax})}`)
        }
        
        
        if(amenities && amenities !== "any") {
            const amenitiesAray = (amenities as string).split(",").map(Number)
            whereCondition.push(Prisma.sql`p.amenities @> ${amenitiesAray}`)
        }

        if(availableFrom && availableFrom !== "any") {
            const availableFromDate = typeof availableFrom === "string" ? availableFrom : null;

            if (availableFromDate){
                const date = new Date(availableFromDate);
                if(!isNaN(date.getTime())){
                    whereCondition.push(Prisma.sql`EXISTS(SELECT 1 FROM "lease" l WHERE l."propertyID" = p.id AND l."startDate" <= ${date.toISOString()})`);
                }
            }
        }

        if(latitude && longitude){
            const lat = parseFloat(latitude as string);
            const lon = parseFloat(longitude as string);
            const RadiusInKillometers = 1000;
            const degrees = RadiusInKillometers / 111;

            whereCondition.push(Prisma.sql`ST_DWithin(l.coordinates::geometry,ST_SetSRID(ST_MakePoint(${lon},${lat}),4326),${degrees})`)
        }

        const completeQuery = Prisma.sql
            `SELECT p.* json_build_object(
                'id', l.id, 
                'address', l.address
                'city', l.city,
                'state', l.state,   
                'country', l.country,
                'postalCode', l."postalCode",
                'coordinates', json_build_object(
                    'longitude', ST_X(l."coordinates"::geometry),
                    'latitude', ST_Y(l."coordinates"::geometry)
                )
            ) as location
            FROM "Property" p
            JOIN "Location" l ON p."locationId" = l.id
            ${whereCondition.length > 0 ? Prisma.sql`WHERE ${Prisma.join(whereCondition, " AND ")}`:Prisma.empty}`;
            
        const properties = await prisma.$queryRaw(completeQuery);

        res.json(properties);

    }
    catch(err :any) {
        res.status(500).json({messgae: `Error ${err.message}`})
    }
}

export const getProperty = async(req: Request, res: Response): Promise<void> => {
    try{
        const {id} = req.params;

        const property = await prisma.property.findUnique({
            where:{id: Number(id)},
            include:{location:true}
        })

        if (property){
            const coordinates: {coordinates: string}[] = await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`;

            const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
            const longitude = geoJSON.coordinates[0];
            const latitude = geoJSON.coordinates[1];
            
            const propertyWithCoordinates ={
                ...property,
                location: { 
                    ...property.location, coordinates: {
                        longitude,
                        latitude 
                    }
                }
            }
            res.json(propertyWithCoordinates)
        }
    }
    
    catch(err :any) {
        res.status(500).json({messgae: `Error ${err.message}`})
    }
}
    

export const createProperty = async (req: Request,res: Response): Promise<void> => {
    try{
        const files = req.files as Express.Multer.File[];
        const{address,city,state,country,postalCode,managerCognitoId, ...propertyData} = req.body;

        const photoUrls = await Promise.all(
            files.map(async (file)=>{
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME!,
                    Key: `properties/${Date.now()}-${file.originalname}}`,
                    body: file.buffer,
                    ContentType: file.mimetype,
                }
                
                const uploadResault = await new Upload({
                    client: s3Client,
                    params: uploadParams,
                }).done();
                
                return uploadResault.Location;

            })
        ) 

        const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
            {
                street: address,
                city,
                country,
                postalcode: postalCode,
                format: "json",
                limit: "1", 
            }
        ).toString()}`;

        const geocodingResponce = await axios.get(geocodingUrl,{
            headers:{
                "User-Agent": "realestateapp"
            }
        })
        const [longitude, latitude] = geocodingResponce.data[0]?.lon && geocodingResponce.data[0]?.lat ? 
        [
            parseFloat(geocodingResponce.data[0]?.lon),
            parseFloat(geocodingResponce.data[0]?.lat),
       
        ]: [0, 0];
        
        const [location] = await prisma.$queryRaw<Location[]>`
            INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
            VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
            RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;`;

        // create property
        const newProperty = await prisma.property.create({
            data: {
              ...propertyData,
              photoUrls,
              locationId: location.id,
              managerCognitoId,
              amenities:
                typeof propertyData.amenities === "string"
                  ? propertyData.amenities.split(",")
                  : [],
              highlights:
                typeof propertyData.highlights === "string"
                  ? propertyData.highlights.split(",")
                  : [],
              isPetsAllowed: propertyData.isPetsAllowed === "true",
              isParkingIncluded: propertyData.isParkingIncluded === "true",
              pricePerMonth: parseFloat(propertyData.pricePerMonth),
              securityDeposit: parseFloat(propertyData.securityDeposit),
              applicationFee: parseFloat(propertyData.applicationFee),
              beds: parseInt(propertyData.beds),
              baths: parseFloat(propertyData.baths),
              squareFeet: parseInt(propertyData.squareFeet),
            },
            include: {
              location: true,
              manager: true,
            },
          });
      
          res.status(201).json(newProperty);
    }
    catch(err :any) {
        res.status(500).json({messgae: `Error ${err.message}`})
    }
};

