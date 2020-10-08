import { ICategory } from "./category";
import { ICourse_Unit } from "./course_unit";
import { IWorkload } from "./workload";

export interface IPrograms {
    id: number
    name: string
    start_period: string
    final_period: string
    mode: string
    categoryId: number
    course_unity: string
    type: string
    allocation: string
    type_evaluation: string
    total_workload: number,
    extension_workload: number,
    weekly: number,
    hour_clock: number,
    form_id: number
}