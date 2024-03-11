import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import  {Usuario}  from '../models/usuario';

import bcrypt from "bcrypt";
import { generarJWT } from '../helpers/jwt-helper';
import { getMenuFrontEnd } from '../helpers/menu';
import {Empresa} from '../models/empresa';

export const login = async  (req:Request, resp:Response)=>{
    console.log('login');
    const {username, password} = req.body
    console.log(username, password);

    
    try {
        
        const usuarioDB = await Usuario.findOne({username}).select('+password')

        if(!usuarioDB){  
            return resp.status(404).json({
                ok:false,
                msg:'Datos no validos'
            })
        }  
        

         const validPassword = bcrypt.compareSync(password, usuarioDB.password);
         if(!validPassword){
             return resp.status(400).json({
                 ok:false,
                 msg:'password invalido'
             })
         }
         
        console.log(JSON.stringify(usuarioDB._id));
        const token = await generarJWT(usuarioDB._id)

        console.log(token);
        return resp.status(200).json({
            ok:true,
            menu:getMenuFrontEnd(usuarioDB.rol),
            usuario:usuarioDB,
            token
        })


    } catch (error) {

        return resp.status(500).json({ 
            okay:false,
            msg:'Porfavor hable con el administrador: '
        })
    }


}

  export const renewToken = async(req:any, resp:Response)=>{

    try {
        console.log('ENTROO RENEW');
        const uid = req.uid;    
        
    
        const token =await generarJWT(uid);
        
        //return user
        console.log('aqui'+uid);


        
        let usuario = await Usuario.findOne({_id:uid}).select('+password');   
    
        if(!usuario){
            return resp.status(404).json({
                ok:false,
                msg:'No se encontro el usuario'
            })
        }
        
        let company = await Empresa.findOne({admin:uid}) 
        if(!company){
            return resp.status(200).json({
                ok:true,
                token,
                uid,
                usuario,
                menu:getMenuFrontEnd(usuario?.rol)
        
            });
        }
        
    
        
        return resp.status(200).json({
            ok:true,
            token,
            uid,
            usuario,
            empresa:company,
            menu:getMenuFrontEnd(usuario?.rol)
    
        });
    } catch (error) {
        resp.json('error oh no'+error)
    }
   


}


