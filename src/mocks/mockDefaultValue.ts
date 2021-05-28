import { IProject, ITransport } from "../interfaces/project";

export const newProject: IProject = {
  _id: "",
  name: "",
  description: "",
  partnership: [],
  typeProject: "common",
  planning: [],
  programId: "",
  categoryId: "",
  noticeId: "",
  resources: {
    transport: null,
    materials: [],
  },
  results: "",
  specificCommunity: {
    location: "",
    peopleInvolved: 0,
    text: "",
  },
  firstSemester: [],
  secondSemester: [],
  totalCH: 0,
  attachments: [],
  author: "",
  dateStart: new Date(),
  dateFinal: new Date(),
  status: "pending",
  disciplines: [],
  teachers: [],
  maxClasses: 0,
};

export const newTransport: ITransport = {
  description: "",
  quantity: 0,
  totalPrice: 0,
  typeTransport: "",
  unitaryValue: 0,
  unity: "",
};
