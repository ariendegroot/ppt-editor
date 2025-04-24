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
  const response = await fetch(process.env.DIENST_API_URL!, { method: "GET" });

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
    <ChurchForm
      prefillData={data[currentIndex]}
      eveningData={data[currentIndex + 1]}
    />
  );
}
