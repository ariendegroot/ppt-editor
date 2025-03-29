"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generatePresentation } from "@/app/actions/generatePresentation";
import { Presentation } from "@/app/page";

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
    .length(8, "There must be 8 psalms"),
  tekst: z.string(),
  lezingen: z.array(z.string().optional()).length(3),
  thema: z.string().optional(),
  avond_ds_waarde: z.enum(["Ds.", "Prop.", "Kand.", "Prof.", "Dhr."]),
  avond_ds_naam: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ChurchForm({prefillData, eveningData} : {prefillData?: Presentation, eveningData?: Presentation}) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datum: prefillData?.Datum ? new Date(prefillData?.Datum).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      o_m_a_waarde: prefillData?.Moment ?? "Ochtend",
      ds_waarde: prefillData?.Titel ?? "Ds.",
      ds_naam: prefillData?.Voorganger ?? "",
      ds_plaatsnaam: prefillData?.Woonplaats ?? "",
      organist: prefillData?.Organist ?? "",
      bijz: "",
      collecte: "",
      psalms: Array(8).fill({ type: "Ps.", number: "", verses: "" }),
      tekst: "",	
      lezingen: ["", "", ""],
      thema: "",
      avond_ds_waarde: eveningData?.Titel ?? "Ds.",
      avond_ds_naam: eveningData?.Voorganger ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      <div>
        <label className="inline-block w-44">Datum</label>
        <input type="date" {...register("datum")} className="border p-2" />
        {errors.datum && <p>{errors.datum.message}</p>}
      </div>
      <div>
        <label className="inline-block w-44">Moment van dienst</label>
        <select {...register("o_m_a_waarde")} className="border p-2">
          <option value="Ochtend">Ochtend</option>
          <option value="Middag">Middag</option>
          <option value="Avond">Avond</option>
        </select>
      </div>
      <div>
        <label className="inline-block w-44">Voorganger</label>
        <select {...register("ds_waarde")} className="border p-2">
          <option value="Ds.">Ds.</option>
          <option value="Prop.">Prop.</option>
          <option value="Kand.">Kand.</option>
          <option value="Prof.">Prof.</option>
          <option value="Dhr.">Dhr.</option>
        </select>
        <input
          type="text"
          {...register("ds_naam")}
          className="border p-2"
          placeholder="Naam"
        />
      </div>
      <div>
        <label className="inline-block w-44">Organist</label>
        <input
          type="text"
          {...register("organist")}
          className="border p-2"
          placeholder="Naam"
        />
      </div>
      <div>
        <label className="inline-block w-44">Uit</label>
        <input
          type="text"
          {...register("ds_plaatsnaam")}
          className="border p-2"
          placeholder="optioneel"
        />
      </div>
      <div>
        <label className="inline-block w-44">Lezing 1</label>
        <input type="text" {...register("lezingen.0")} className="border p-2" />
      </div>
      <div>
        <label className="inline-block w-44">Lezing 2</label>
        <input type="text" {...register("lezingen.1")} className="border p-2" />
      </div>
      <div>
        <label className="inline-block w-44">Lezing 3</label>
        <input type="text" {...register("lezingen.2")} className="border p-2" />
      </div>
      <div>
        <label className="inline-block w-44">Thema van preek</label>
        <input type="text" {...register("thema")} className="border p-2" />
      </div>
      <div>
        <label className="font-bold text-xl pb-2 inline-block">
          Psalmen en liederen
        </label>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex space-x-2">
            <select
              {...register(`psalms.${index}.type`)}
              className="border p-2"
            >
              <option value="Ps.">Ps.</option>
              <option value="Ps.Wk.">Ps.Wk.</option>
              <option value="Wk.">Wk.</option>
              <option value="Gez.">Gez.</option>
            </select>
            <input
              type="text"
              {...register(`psalms.${index}.number`)}
              className="border p-2"
              placeholder="Nummer"
            />
            <input
              type="text"
              {...register(`psalms.${index}.verses`)}
              className="border p-2"
              placeholder="Verzen"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="inline-block w-44">Tekst voor preek</label>
        <input type="text" {...register("tekst")} className="border p-2" />
      </div>
      <div>
        <label className="inline-block w-44">Voorganger avond:</label>
        <select {...register("avond_ds_waarde")} className="border p-2">
          <option value="Ds.">Ds.</option>
          <option value="Prop.">Prop.</option>
          <option value="Kand.">Kand.</option>
          <option value="Prof.">Prof.</option>
          <option value="Dhr.">Dhr.</option>
        </select>
        <input
          type="text"
          {...register("avond_ds_naam")}
          className="border p-2"
          placeholder="Alleen in geval avonddienst"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Verzenden
      </button>
    </form>
  );
}
