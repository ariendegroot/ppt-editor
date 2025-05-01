'use server'

import { revalidatePath } from 'next/cache'

export async function generatePresentation(formData: FormData) {
  const datumValue = formData.get('datum');
  let formattedDate = '';

  if (typeof datumValue === 'string') {
    const date = new Date(datumValue);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    formattedDate = `${day}-${month}-${year}`;
  }

  const payload = {
    datum_tekst: formattedDate,
    o_m_a_waarde: formData.get('o_m_a_waarde'),
    ds_waarde: formData.get('ds_waarde'),
    ds_naam_tekst: formData.get('ds_naam'),
    ds_plaatsnaam_tekst: formData.get('ds_plaatsnaam'),
    organist_tekst: formData.get('organist'),
    psalms: JSON.parse(formData.get('psalms')?.toString() ?? 'null'),
    lezingen: JSON.parse(formData.get('lezingen')?.toString() ?? 'null'),
    avond_ds_waarde: formData.get('avond_ds_waarde'),
    avond_ds_naam_tekst: formData.get('avond_ds_naam'),
  };


  const response = await fetch(process.env.PPT_API_URL + "/generate_ppt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const blob = await response.blob();
    // You'll need to handle file download differently in a server action
    // This is just a placeholder
    console.log('Presentation generated successfully');
    const filename = response.headers.get('Content-Disposition')?.split('filename=')[1];
    console.log({filename})
    const strippedFileName = filename?.replace(/"/g, '');
    return { blob, filename: strippedFileName } as { blob: Blob; filename: string };
  }

  revalidatePath('/');
}