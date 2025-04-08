import Link from "next/link";
export interface Presentation {
  Datum: string;
  Moment: "Ochtend" | "Avond";
  Titel: "Ds." | "Prop." | "Kand." | "Prof." | "Dhr.";
  Voorganger: string;
  Woonplaats: string;
  Organist: string;
  Collectedoel: string;
  Voorzang: string;
  Bijzonderheden: string;
  Maker: string;
}

// Helper function to group presentations by date
function groupByDate(
  presentations: Presentation[]
): Record<string, Presentation[]> {
  return presentations.reduce((acc, presentation) => {
    const { Datum } = presentation;
    if (!acc[Datum]) {
      acc[Datum] = [];
    }
    acc[Datum].push(presentation);
    return acc;
  }, {} as Record<string, Presentation[]>);
}

// Helper function to format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function Home() {
  if (!process.env.DIENST_API_URL) {
    throw new Error("DIENST_API_URL environment variable is not defined");
  }
  const response = await fetch(process.env.DIENST_API_URL, { method: "GET" });
  const data = (await response.json()) as Presentation[];

  return (
    <>
      <div className="bg-slate-700">
        <div className="max-w-5xl m-auto py-2">
          <h1 className="text-2xl font-bold text-white">Aankomende diensten</h1>
        </div>
      </div>
      <div className="max-w-5xl m-auto px-4">
        {/* Group the data by date */}
        {Object.entries(groupByDate(data)).map(([date, services]) => (
          <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              {formatDate(date)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.Datum + service.Moment}
                  className="bg-white rounded-md p-4 shadow-md hover:shadow-lg transition-shadow relative"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        {service.Moment}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {service.Titel} {service.Voorganger}
                        {service.Woonplaats && (
                          <span className="text-gray-500 text-sm">
                            {" "}
                            uit {service.Woonplaats}
                          </span>
                        )}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Organist: {service.Organist}
                      </p>
                    </div>
                    <Link
                      href={`/${service.Datum}/${service.Moment.toLowerCase()}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Selecteren
                      <span className="absolute inset-0">{service.Datum}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
