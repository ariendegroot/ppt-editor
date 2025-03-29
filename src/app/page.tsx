import ChurchForm from "@/components/forms/createPresentation";
export interface Presentation {
  Datum: string;
  Moment: "Ochtend" | "Avond";
  Titel: "Ds." |"Prop." | "Kand." | "Prof."| "Dhr.";
  Voorganger: string;
  Woonplaats: string;
  Organist: string;
  Collectedoel: string;
  Voorzang: string;
  Bijzonderheden: string;
  Maker: string;
}

export default async function Home() {
  const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjEewWuTfakUedopNfDJJ79aBywbd9Op-sn6Z1xi6vxtTC4qEG7GJmAziYmR9w4nQSSn61CsuGkpAqsD5PWtzbfAxSv59K-nCzQLixZ_zs9u9oE1WCfPcWDx0icCJfM3VU-GlaMgkcJ51obXoHa0oE1OxEEmwT-t7XjKJRnkxqRFRPEp3geTztr38Kwgvjgi2MLQfuvqV-f8Vx6OByhJHPlPqCByBBql3SkZq2z4OdasJ0vgKXivlBYRi8zV8xSrSFd-fO1xKguBcvhTsVF_lQ2VSPaYQ&lib=MXtOAJdVTrkFsJNTg8HR3KV0iYKxH7YhB", { method: "GET" });
  const data = await response.json() as Presentation[];

  return (
    <>
    <div className="bg-slate-700">
      <div className="max-w-5xl m-auto py-2">
          <h1 className="text-2xl font-bold text-white">Presentatie maken</h1>
      </div>
    </div>
    <div className="flex flex-col max-w-5xl m-auto">
      <ChurchForm prefillData={data[3]} eveningData={data[3]}/>
    </div>
    </>
  );
}
