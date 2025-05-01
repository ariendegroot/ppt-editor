"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generatePresentation } from "@/app/actions/generatePresentation";
import { Presentation } from "@/app/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-simple";

const formSchema = z.object({
  datum: z.string().min(1, "Datum is required"),
  o_m_a_waarde: z.enum(["Ochtend", "Avond"]),
  ds_waarde: z.enum(["Ds.", "Prop.", "Kand.", "Prof.", "Dhr."]),
  ds_naam: z.string().min(1, "Voorganger naam is required"),
  ds_plaatsnaam: z.string().optional(),
  organist: z.string().min(1, "Organist is required"),
  bijz: z.string().optional(),
  collecte: z.string().optional(),
  psalms: z
    .array(
      z.object({
        type: z.enum(["Ps.", "Ps.Wk.", "Wk.", "Gez."]),
        number: z.string(),
        verses: z.string(),
      })
    )
    .length(6, "There must be at least 6 psalms"),
  tekst: z.string(),
  lezingen: z.array(z.string().optional()).length(3),
  thema: z.string().optional(),
  avond_ds_waarde: z.enum(["Ds.", "Prop.", "Kand.", "Prof.", "Dhr."]),
  avond_ds_naam: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ChurchForm({
  prefillData,
  eveningData,
}: {
  prefillData?: Presentation;
  eveningData?: Presentation;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datum: prefillData?.Datum
        ? new Date(prefillData?.Datum).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      o_m_a_waarde: prefillData?.Moment ?? "Ochtend",
      ds_waarde: prefillData?.Titel ?? "Ds.",
      ds_naam: prefillData?.Voorganger ?? "",
      ds_plaatsnaam: prefillData?.Woonplaats ?? "",
      organist: prefillData?.Organist ?? "",
      bijz: "",
      collecte: "",
      psalms: Array(6).fill({ type: "Ps.", number: "", verses: "" }),
      tekst: "",
      lezingen: ["", "", ""],
      thema: "",
      avond_ds_waarde: eveningData?.Titel ?? "Ds.",
      avond_ds_naam: eveningData?.Voorganger ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("HII");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        // Else, it should be a string or Blob, so append it directly
        formData.append(key, value);
      }
    });
    console.log(JSON.stringify(data, null, 2));
    const file = await generatePresentation(formData);
    if (!file?.blob) {
      console.error("Failed to generate presentation");
      return;
    }
    const url = window.URL.createObjectURL(file.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="datum"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-block w-44">Datum</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-2"></div>
          <FormField
            control={form.control}
            name="o_m_a_waarde"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-block w-44">
                  Moment van dienst
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="Ochtend">Ochtend</option>
                    <option value="Middag">Middag</option>
                    <option value="Avond">Avond</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-2 items-center">
          <FormField
            control={form.control}
            name="ds_waarde"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-block w-44">Voorganger</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="Ds.">Ds.</option>
                    <option value="Prop.">Prop.</option>
                    <option value="Kand.">Kand.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Dhr.">Dhr.</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ds_naam"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-block w-44"></FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="Naam" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="ds_plaatsnaam"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">Uit</FormLabel>
              <FormControl>
                <Input
                  className="md:w-1/3"
                  type="text"
                  {...field}
                  placeholder="optioneel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organist"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">Organist</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="md:w-1/3"
                  {...field}
                  placeholder="Naam"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <label className="font-bold text-xl pb-2 inline-block">
            Psalmen en liederen
          </label>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <FormField
                control={form.control}
                name={`psalms.${index}.type` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select {...field}>
                        <option value="Ps.">Ps.</option>
                        <option value="Ps.Wk.">Ps.Wk.</option>
                        <option value="Wk.">Wk.</option>
                        <option value="Gez.">Gez.</option>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`psalms.${index}.number` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" {...field} placeholder="Nummer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`psalms.${index}.verses` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" {...field} placeholder="Verzen" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="thema"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">
                Thema van preek
              </FormLabel>
              <FormControl>
                <Input type="text" className="md:w-1/3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tekst"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">
                Tekst voor preek
              </FormLabel>
              <FormControl>
                <Input className="md:w-1/3" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lezingen.0"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">Lezing 1</FormLabel>
              <FormControl>
                <Input type="text" {...field} className="md:w-1/3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lezingen.1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">Lezing 2</FormLabel>
              <FormControl>
                <Input type="text" className="md:w-1/3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lezingen.2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">Lezing 3</FormLabel>
              <FormControl>
                <Input type="text" className="md:w-1/3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="avond_ds_waarde"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-block w-44">
                  Voorganger avond:
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="Ds.">Ds.</option>
                    <option value="Prop.">Prop.</option>
                    <option value="Kand.">Kand.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Dhr.">Dhr.</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avond_ds_naam"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="inline-block w-44"></FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Alleen in geval avonddienst"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bijz"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">
                Bijzonderheden
              </FormLabel>
              <FormControl>
                <Input className="md:w-1/3" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collecte"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="inline-block w-44">Collectedoel</FormLabel>
              <FormControl>
                <Input className="md:w-1/3" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Presentatie maken
        </button>
      </form>
    </Form>
  );
}
