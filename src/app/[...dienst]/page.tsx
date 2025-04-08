import ChurchForm from "@/components/forms/createPresentation";
import { Presentation } from "../page";

// Option 1: Let Next.js infer the types (recommended)
export default async function DienstPage(props: {
  params: Promise<{ dienst: string[] }>;
}) {
  const params = await props.params;
  // Get the path segments from the params
  const { dienst } = params; // Remove the 'await' since params is not a Promise
  const pathSegments = dienst;

  // Construct the query string
  const response = await fetch(
    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjEewWuTfakUedopNfDJJ79aBywbd9Op-sn6Z1xi6vxtTC4qEG7GJmAziYmR9w4nQSSn61CsuGkpAqsD5PWtzbfAxSv59K-nCzQLixZ_zs9u9oE1WCfPcWDx0icCJfM3VU-GlaMgkcJ51obXoHa0oE1OxEEmwT-t7XjKJRnkxqRFRPEp3geTztr38Kwgvjgi2MLQfuvqV-f8Vx6OByhJHPlPqCByBBql3SkZq2z4OdasJ0vgKXivlBYRi8zV8xSrSFd-fO1xKguBcvhTsVF_lQ2VSPaYQ&lib=MXtOAJdVTrkFsJNTg8HR3KV0iYKxH7YhB",
    { method: "GET" }
  );

  const date = pathSegments[0];
  const moment = pathSegments[1];
  const data = (await response.json()) as Presentation[];

  //get data for the current path
  const currentIndex = data.findIndex(
    (d) =>
      d.Datum === date &&
      d.Moment.toLocaleLowerCase() === moment.toLocaleLowerCase()
  );

  return (
    <>
      <div className="bg-slate-700 sticky top-0">
        <div className="max-w-5xl py-2 px-8">
          <h1 className="text-2xl font-bold text-white">Presentatie maken</h1>
        </div>
      </div>
      <div className="p-8">
        <ChurchForm
          prefillData={data[currentIndex]}
          eveningData={data[currentIndex + 1]}
        />
      </div>
    </>
  );
}
