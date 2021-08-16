import api from "../api";

import { Program } from "../../interfaces/program";

declare type ResultResponse = "success" | "error";

export interface ReturnResponsePost
{
    program?: Program,
    message: string,
    created: boolean,
    result: ResultResponse
}

interface ReturnResponseGet
{
    message: string,
    programs: Program[]
}

export const createProgram = async (program: Program): Promise<ReturnResponsePost> =>
{
    const response = await api.post("/program", program)

    return response.data
}

export const listPrograms = async (): Promise<ReturnResponseGet> =>
{
    const response = await api.get("/program")

    return response.data
}