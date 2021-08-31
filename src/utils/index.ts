import { useLocation } from "react-router";

import { Register } from "../interfaces/feedback";

export const compareDate = (a: Register, b: Register) =>
{
    return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
}
