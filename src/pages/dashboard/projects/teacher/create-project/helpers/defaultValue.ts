import { Project } from "../../../../../../interfaces/project";

const now = new Date();
export const defaultValue: Project =
{
  _id: "",
  author: "",
  category: "",
  dateFinal: now,
  dateStart: now,
  description: "",
  disciplines: [],
  firstSemester: [],
  maxClasses: 0,
  name: "",
  notice: "",
  partnership: [],
  planning: [],
  program: "",
  resources:
  {
    materials: []
  },

  secondSemester: [],
  specificCommunity:
  {
    location: "",
    peopleInvolved: 0,
    text: "",
  },

  status: "pending",
  teachers: [],
  totalCH: 0,
  typeProject: "common",
};