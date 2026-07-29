// frontend/src/pages/admin/EditCollaborator.jsx

import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2, Pencil } from "lucide-react"

import api from "../../services/api"

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

const EditCollaborator = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [collaborator, setCollaborator] = useState({

        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        contract_type: "",
        department: "",
        position: "",
        hire_date: "",

    })


    useEffect(() => {

        fetchCollaborator()

    }, [])



    const fetchCollaborator = async () => {

        try {

            const response = await api.get(
                `/admin/collaborators/${id}/`
            )

            setCollaborator(response.data)

        }

        catch (error) {

            console.log(error)

        }

    }



    const handleChange = (e) => {

        setCollaborator({

            ...collaborator,
            [e.target.name]: e.target.value

        })

    }



    const handleUpdate = async (e) => {

        e.preventDefault()

        setLoading(true)

        try {

            await api.put(

                `/admin/collaborators/${id}/`,
                collaborator

            )


            alert(
                "Collaborateur modifié avec succès."
            )

            navigate(
                "/admin/collaborators"
            )


        } catch (error) {

    console.log("Erreur :", error)

    console.log(
        "Status :",
        error.response?.status
    )

    console.log(
        "Data :",
        error.response?.data
    )

    if (error.response?.data) {

        alert(
            JSON.stringify(
                error.response.data,
                null,
                2
            )
        )

    } else {

        alert(
            "Erreur lors de la modification."
        )

    }

}

        setLoading(false)

    }



    return (

        <>

            <PageHeader
                icon={Pencil}
                title="Modifier un collaborateur"
                subtitle="Modifiez les informations du collaborateur."
            />


            <div className="p-8">

                <div className="rounded-3xl bg-white shadow-md border border-slate-200 overflow-hidden">

                    <form
                        onSubmit={handleUpdate}
                    >

                        {/* Informations personnelles */}


                        <div className="p-8 border-b border-slate-200">

                            <h2 className="text-xl font-bold text-[#0F2557] mb-8">

                                Informations personnelles

                            </h2>


                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


                                <div>

                                    <Label>
                                        Prénom
                                    </Label>

                                    <Input

                                        name="first_name"

                                        value={
                                            collaborator.first_name || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>



                                <div>

                                    <Label>
                                        Nom
                                    </Label>

                                    <Input

                                        name="last_name"

                                        value={
                                            collaborator.last_name || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>



                                <div>

                                    <Label>
                                        Téléphone
                                    </Label>

                                    <Input

                                        name="phone"

                                        value={
                                            collaborator.phone || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>



                                <div className="xl:col-span-3">

                                    <Label>
                                        Email
                                    </Label>

                                    <Input

                                        name="email"

                                        value={
                                            collaborator.email || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>


                            </div>

                        </div>



                        {/* Contrat */}


                        <div className="p-8 border-b border-slate-200">


                            <h2 className="text-xl font-bold text-[#0F2557] mb-8">

                                Poste & Contrat

                            </h2>



                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


                                <div>

                                    <Label>
                                        Département
                                    </Label>

                                    <Input

                                        name="department"

                                        value={
                                            collaborator.department || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>



                                <div>

                                    <Label>
                                        Poste
                                    </Label>

                                    <Input

                                        name="position"

                                        value={
                                            collaborator.position || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>



                                <div>

                                    <Label>
                                        Date d'embauche
                                    </Label>

                                    <Input

                                        type="date"

                                        name="hire_date"

                                        value={
                                            collaborator.hire_date || ""
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className="mt-2 h-12 rounded-xl"

                                    />

                                </div>




                                <div>

                                    <Label>
                                        Rôle
                                    </Label>

                                    <Select

                                        value={
                                            collaborator.role || ""
                                        }

                                        onValueChange={(value) =>

                                            setCollaborator({

                                                ...collaborator,
                                                role: value

                                            })

                                        }

                                    >

                                        <SelectTrigger className="mt-2 h-12 rounded-xl">

                                            <SelectValue />

                                        </SelectTrigger>


                                        <SelectContent>

                                            <SelectItem value="EMPLOYE">
                                                Employé
                                            </SelectItem>

                                            <SelectItem value="STAGIAIRE">
                                                Stagiaire
                                            </SelectItem>

                                            <SelectItem value="FREELANCE">
                                                Freelance
                                            </SelectItem>

                                        </SelectContent>


                                    </Select>

                                </div>




                                <div>

                                    <Label>
                                        Contrat
                                    </Label>

                                    <Select

                                        value={
                                            collaborator.contract_type || ""
                                        }

                                        onValueChange={(value) =>

                                            setCollaborator({

                                                ...collaborator,
                                                contract_type: value

                                            })

                                        }

                                    >

                                        <SelectTrigger className="mt-2 h-12 rounded-xl">

                                            <SelectValue />

                                        </SelectTrigger>


                                        <SelectContent>

                                            <SelectItem value="CDI">
                                                CDI
                                            </SelectItem>

                                            <SelectItem value="CDD">
                                                CDD
                                            </SelectItem>

                                            <SelectItem value="STAGE">
                                                Stage
                                            </SelectItem>

                                            <SelectItem value="FREELANCE">
                                                Freelance
                                            </SelectItem>

                                        </SelectContent>


                                    </Select>

                                </div>


                            </div>

                        </div>



                        {/* Boutons */}


                        <div className="p-8 bg-slate-50 flex justify-end gap-4">


                            <Button

                                type="button"

                                variant="outline"

                                onClick={() =>

                                    navigate(
                                        "/admin/collaborators"
                                    )

                                }

                            >

                                Annuler

                            </Button>



                            <Button

                                type="submit"

                                disabled={loading}

                                className="bg-[#2F67F6] text-white"

                            >

                                {loading ?

                                    <>

                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />

                                        Modification...

                                    </>

                                    :

                                    "Modifier"

                                }

                            </Button>


                        </div>


                    </form>

                </div>

            </div>

        </>

    )

}

export default EditCollaborator