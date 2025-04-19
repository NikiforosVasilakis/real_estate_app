import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getTenant = async(req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId} = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: {cognitoId},
            include:{
                favorites: true
            }
        })
        if(tenant){
            res.json(tenant)
        }else{
            res.status(404).json({message:"Tenant not found"})
        }
    }catch(error:any){
        res.status(500).json({message:`Error retriving tenant${error.message}`})
    }
}

export const createTenant = async(req: Request, res: Response): Promise<void> => {
    try{
        const {cognitoId, name, email, phoneNumber} = req.body;
        
        const tenant = await prisma.tenant.create({
           data:{
            cognitoId,
            name,
            email,
            phoneNumber
           }
        })    
     res.status(201).json(tenant);
    }catch(error:any){
        res.status(500).json({message:`Error creatining tenant${error.message}`})
    }
}

export const updateTenant = async (req: Request,res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;
  
    const updateTenant = await prisma.tenant.update({

      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });
    res.json(updateTenant);
  }
  catch (error: any) {
    res.status(500).json({ message: `Error updating tenant: ${error.message}` });
  }
};

export const getCurrentResidencies = async(req: Request, res: Response): Promise<void> => {

  try{
    const { cognitoId }= req.params;
    const properties = await prisma.property.findMany({
      where:
        {tenants: { some: { cognitoId } }},
        include:{
          location: true
        }
    })

    const residenciesWithFormatedLocation = await Promise.all(
      properties.map(async(property)=> {
        const coordinates: {coordinates: string}[] = await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates FROM "Location" WHERE id = ${property.location.id}`;
        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];
            
        return{
          ...property,
          location: {...property.location, coordinates: {
              longitude,
              latitude, 
            }
          }
        }
      })
    )

    res.json(residenciesWithFormatedLocation)
  }catch(err :any) {
    res.status(500).json({messgae: `Error ${err.message}`})
  }
}  

export const getFavoriteProperty = async(req: Request, res: Response): Promise<void> =>{
  try{
    const { cognitoId, propertyId } = req.params;
    const tenat = await prisma.tenant.findUnique({
      where: {cognitoId},
      include: {favorites: true},
    })
    const propertyIdNumber = Number(propertyId);
    const existingFavorites = tenat?.favorites || [];

    if (!existingFavorites.some((fav)=> fav.id === propertyIdNumber)){
      const updatedTenant = await prisma.tenant.update({
        where:{cognitoId}, 
        data:{
          favorites:{
            connect: {id: propertyIdNumber}
          }
        },
        include: {favorites:true}
      })
      res.json(updatedTenant)
    }else{
      res.status(409).json({message: "already added to the favs"})
    }
  }
  catch(error:any){
    res.status(500).json({ message: `Error updating tenant: ${error.message}` });
  }
}

export const RemoveFavoriteProperty = async(req: Request, res: Response): Promise<void> =>{
  try{
    const { cognitoId, propertyId } = req.params;
    const propertyIdNumber = Number(propertyId);
    
    const updatedTenant = await prisma.tenant.update({
      where:{cognitoId},
      data:{
        favorites:{
          disconnect: {id: propertyIdNumber}
        },
      },
      include: {favorites:true}
    })
    res.json(updateTenant)
  }
  catch(error:any){
    res.status(500).json({ message: `Error removing prop: ${error.message}` });
  }
} 