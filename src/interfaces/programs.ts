import { ICategory } from "./category";
import { ICourse_Unit } from "./course_unit";
import { IWorkload } from "./workload";

export interface IPrograms {
    id: number
    name: string
    start_period: Date
    final_period: Date
    mode: string
    category: ICategory
    course_unity: ICourse_Unit
    type: string
    allocation: string
    type_evaluation: string
    workload: IWorkload,
}