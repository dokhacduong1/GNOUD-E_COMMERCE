import {NextFunction, Request, Response} from "express";
import {validateRequiredFields} from "../../helpers_api/validate_required_fields";

export const detailAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{
            const {place_id, sesionToken} = req.body;
            const requiredFields = [
                { field: place_id, message: "Place ID is required" },
                { field: sesionToken, message: "Sesion Token is required" },
            ];
            if (!validateRequiredFields(requiredFields, res)) {
                return;
            }
            next();
    }catch (error){

        res.status(500).json({ message: "Internal server error" });
    }
}