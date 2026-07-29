// frontend/src/pages/admin/UploadDocument.jsx

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"

import {
  FileUp,
  Loader2,
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

import PageHeader from "../../components/layout/PageHeader"
import api from "../../services/api"



const MAX_FILE_SIZE = 5 * 1024 * 1024


const documentSchema = z.object({

  user: z.string().min(1),

  name: z.string().min(1),

  type: z.enum([
    "CONTRACT",
    "ADDENDUM",
    "OTHER",
  ]),

  file: z
    .instanceof(FileList)
    .refine(
      (files) => files.length === 1,
      "Le fichier est obligatoire"
    )
    .refine(
      (files) =>
        files[0]?.type === "application/pdf",
      "Le fichier doit être un PDF"
    )
    .refine(
      (files) =>
        files[0]?.size <= MAX_FILE_SIZE,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),

})



const UploadDocument = () => {

  const navigate = useNavigate()

  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  const {

    register,
    handleSubmit,
    setValue,
    watch,

    formState: {
      errors,
      isSubmitting,
    },

  } = useForm({

    resolver:
      zodResolver(documentSchema),

  })


  useEffect(() => {

    const fetchCollaborators = async () => {

      try {

        const response =
          await api.get("/auth/users/")


        const employees =
          response.data.filter(
            (user) =>
              user.role !== "ADMIN"
          )


        setCollaborators(employees)

      }

      catch (error) {

        console.error(error)

        setCollaborators([

          {
            id: "1",
            first_name: "Hanaa",
            last_name: "Birouki",
          },

          {
            id: "2",
            first_name: "Marwa",
            last_name: "Boubekri",
          },

        ])

      }

    }

    fetchCollaborators()

  }, [])



  const onSubmit = async (data) => {

    setLoading(true)

    setError("")

    try {

      const formData =
        new FormData()


      formData.append(
        "user",
        data.user
      )


      formData.append(
        "name",
        data.name
      )


      formData.append(
        "type",
        data.type
      )


      formData.append(
        "file_url",
        data.file[0]
      )



      await api.post(

        "/admin/documents/upload/",

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      )


      alert(
        "Document uploadé avec succès."
      )


      navigate("/admin/documents")

    }

    catch (error) {

      console.error(error)

      setError(
        "Erreur lors de l'upload."
      )

    }

    finally {

      setLoading(false)

    }

  }



  return (

    <>

      <PageHeader
        icon={FileUp}
        title="Uploader un document"
        subtitle="Importez les documents officiels des collaborateurs au format PDF."
      />



      <div className="p-8">

        <div className="max-w-7xl mx-auto rounded-3xl bg-white shadow-md overflow-hidden border border-slate-200">


          <form
            onSubmit={
              handleSubmit(onSubmit)
            }
          >


            {/* INFORMATIONS */}


            <div className="p-8 border-b border-slate-200">

              <h2
                className="
                text-xl
                font-bold
                text-[#0F2557]
                mb-6
                "
              >

                Informations du document

              </h2>



              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
                "
              >


                {/* COLLABORATEUR */}


                <div>

                  <Label>
                    Collaborateur
                  </Label>


                  <Select
                    onValueChange={
                      (value) =>
                        setValue(
                          "user",
                          value
                        )
                    }
                  >

                    <SelectTrigger
                      className="
                      mt-2
                      h-12
                      rounded-xl
                      "
                    >

                      <SelectValue
                        placeholder="Sélectionner un collaborateur"
                      />

                    </SelectTrigger>


                    <SelectContent>

                      {

                        collaborators.map(

                          (user) => (

                            <SelectItem
                              key={user.id}
                              value={String(user.id)}
                            >

                              {user.first_name}
                              {" "}
                              {user.last_name}

                            </SelectItem>

                          )

                        )

                      }

                    </SelectContent>


                  </Select>

                </div>



                {/* TYPE */}


                <div>

                  <Label>
                    Type du document
                  </Label>


                  <Select
                    onValueChange={
                      (value) =>
                        setValue(
                          "type",
                          value
                        )
                    }
                  >

                    <SelectTrigger
                      className="
                      mt-2
                      h-12
                      rounded-xl
                      "
                    >

                      <SelectValue
                        placeholder="Sélectionner un type"
                      />

                    </SelectTrigger>


                    <SelectContent>

                      <SelectItem value="CONTRACT">
                        Contrat
                      </SelectItem>

                      <SelectItem value="ADDENDUM">
                        Avenant
                      </SelectItem>

                      <SelectItem value="OTHER">
                        Autre document
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </div>



                {/* NOM */}


                <div>

                  <Label>
                    Nom du document
                  </Label>


                  <Input
                    placeholder="Ex : Contrat CDI 2026"
                    className="
                    mt-2
                    h-12
                    rounded-xl
                    "
                    {...register("name")}
                  />

                </div>


              </div>

            </div>



            {/* PDF */}


            <div className="p-8 border-b border-slate-200">


              <h2
                className="
                text-xl
                font-bold
                text-[#0F2557]
                mb-6
                "
              >
                Fichier PDF
              </h2>



              <div
                className="
                border-2
                border-dashed
                border-slate-300
                rounded-2xl
                p-10
                text-center
                "
              >

                <FileUp
                  className="
                  w-12
                  h-12
                  mx-auto
                  text-[#2F67F6]
                  mb-4
                  "
                />


                <p
                  className="
                  font-medium
                  text-lg
                  "
                >
                  Cliquez pour sélectionner votre fichier PDF
                </p>


                <p
                  className="
                  text-slate-500
                  mt-2
                  "
                >
                  PDF uniquement • Taille maximale 5 Mo
                </p>


                <Input
                  type="file"
                  accept=".pdf"
                  className="mt-6"
                  {...register("file")}
                />

              </div>


            </div>



            {/* BOUTONS */}


            <div
              className="
              p-8
              bg-slate-50
              flex
              justify-end
              gap-4
              "
            >

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    "/admin/documents"
                  )
                }
                className="
                h-12
                px-8
                rounded-xl
                "
              >

                Annuler

              </Button>



              <Button
    type="submit"
    disabled={isSubmitting || loading}
    className="
        h-12
        px-8
        rounded-xl
        bg-[#2F67F6]
        hover:bg-[#1D4ED8]
        text-white
        shadow-lg
        hover:shadow-xl
        transition-all
        duration-300
        gap-2
    "
>
    {isSubmitting || loading ? (
        <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Upload...
        </>
    ) : (
        <>
            <FileUp className="w-4 h-4" />
            Uploader le document
        </>
    )}
</Button>
            </div>


          </form>

        </div>

      </div>

    </>

  )

}

export default UploadDocument