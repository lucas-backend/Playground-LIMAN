// import dummyAdPic from "../../../assets/images/dummyAdPic.webp";
// import dummyProfilePic from "../../../assets/images/dummyProfilePic.webp";

export interface IAd {
  id: number;
  title: string;
  name: string;
  link?: string;
  imageLink: string;
}

export const ads: IAd[] = [
  {
    id: 1,
    title: "Promo SanEdu",
    name: "SanEdu",
    link: "#",
    imageLink: "#",
  },
  {
    id: 2,
    title: "Promo SanEdu 2",
    name: "SanEdu",
    // link: "#",
    imageLink: "#",
  },
];
