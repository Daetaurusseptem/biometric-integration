import { Response, Request, NextFunction }  from'express';
import {Usuario} from '../models/usuario';
import { Empresa } from '../models/empresa';


const jwt  = require('jsonwebtoken');
 
export const verifyToken = (req : any, resp : Response, next:NextFunction)=>{

    const token = req.header('x-token');
    
    if(!token){
        return resp.status(401).json({
            ok:false,
            msg:`no hay token en la validacion`
        });
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.JWT);
    
        req.uid = uid;

        next();
        
    } catch (error) {
        return resp.status(401).json({
            ok:false, 
            msg:`token no valido ${error}`
        });
    }

}

export const validarAdminOrSysAdmin = async(req:any, resp:Response, next:any)  => {

    const uid = req.uid;
    
    try {
        
        const usuarioDB = await Usuario.findById(uid );

        if ( !usuarioDB ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        
        if ( usuarioDB.rol =='user' ) {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }


        next();


    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
export const validarSysAdmin = async(req:any, resp:Response, next:any)  => {

    const uid = req.uid;
    
    try {
        console.log(uid);
        const usuarioDB = await Usuario.findById(uid );

        if ( !usuarioDB ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if ( usuarioDB.get('rol') !== 'sysadmin' ) {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        next();


    } catch (error) {
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
export const validarAdmin = async(req:any, resp:Response, next:any)  => {

    const uid = req.uid;
    
    try {
        console.log(uid);
        const usuarioDB = await Usuario.findById(uid );

        if ( !usuarioDB ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if ( usuarioDB.get('rol') !== 'admin' ) {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        next();


    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
export const validarAdminCompany = async(req:any, resp:Response, next:any)  => {

    const uid = req.uid;
    const {companyId }  =  req.params
    
    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return resp.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
        const companyAdminId = await Empresa.findById(companyId);

        if ( usuarioDB.get('rol') !== 'admin' ) {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        if ( !companyAdminId?.admins.includes == uid) {
            return resp.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso en esta empresa',
                
            });
        }

        next();


    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}
