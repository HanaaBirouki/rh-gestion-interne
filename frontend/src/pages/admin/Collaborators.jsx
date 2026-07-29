// frontend/src/pages/admin/Collaborators.jsx
import React, { useState, useEffect } from "react"
import { UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger,
DropdownMenuSeparator
}
from "../../components/ui/dropdown-menu"
import {
MoreHorizontal,
Pencil,
Trash2,
UserX
}
from "lucide-react"
import {
Users,
Search,
Filter,
User,
Briefcase,
GraduationCap,
} from "lucide-react"

import { Button } from "../../components/ui/button"

import { Input } from "../../components/ui/input"

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "../../components/ui/select"

import { Switch } from "../../components/ui/switch"

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "../../components/ui/table"

import { Badge } from "../../components/ui/badge"

import api from "../../services/api"

import PageHeader from "../../components/layout/PageHeader"
const Collaborators = () => {
  const [collaborators, setCollaborators] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const navigate = useNavigate()
  useEffect(() => {
    const fetchCollaborators = async () => {
      const handleUpdate = async () => {

  try {

    await api.put(

      `/admin/collaborators/${id}/`,

      collaborator

    )

    alert("Collaborateur modifié avec succès.")

  } catch (error) {

    console.log(error)

    console.log(error.response)

    console.log(error.response?.data)

    alert("Erreur lors de la modification.")

  }

}
      try {
        const response = await api.get("/auth/users/")
        setCollaborators(response.data)
      } catch (error) {
        console.error("Erreur chargement collaborateurs:", error)
        // Données fictives
        setCollaborators([
          { id: 1, first_name: "Hanae", last_name: "Birouki", email: "hanae@test.com", role: "EMPLOYE", contract_type: "CDI", is_active: true },
          { id: 2, first_name: "Marwa", last_name: "Boubekri", email: "marwa@test.com", role: "STAGIAIRE", contract_type: "STAGE", is_active: true },
          { id: 3, first_name: "Ouissam", last_name: "Invest", email: "ouissam@test.com", role: "EMPLOYE", contract_type: "CDD", is_active: false },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchCollaborators()
  }, [])

  const handleToggleActive = async (id, currentStatus) => {
    const handleDelete = async (id) => {

console.log("ID =", id)

const confirmation = window.confirm(
"Voulez-vous supprimer ce collaborateur ?"
)

if (!confirmation){
return
}

try{

console.log("Je vais supprimer :", id)

await api.delete(
`/admin/collaborators/${id}/`
)

console.log("Collaborateur supprimé")

setCollaborators((prev)=>
prev.filter((c)=> c.id !== id)
)

alert("Collaborateur supprimé.")

}catch(error){

console.log("ERREUR = ", error)

console.log("REPONSE =", error.response)

console.log("DATA =", error.response?.data)

alert(
"Impossible de supprimer ce collaborateur."
)

}

}
    try {
      await api.post(`/auth/users/${id}/activate/`, { is_active: !currentStatus })
      setCollaborators(prev =>
        prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c)
      )
    } catch (error) {
      console.error("Erreur activation/désactivation:", error)
    }
  }

  const filtered = collaborators.filter(c => {
    const matchSearch = `${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchRole = roleFilter === "ALL" ? true : c.role === roleFilter
    return matchSearch && matchRole
  })
const totalCollaborateurs = collaborators.length

const totalEmployes = collaborators.filter(
(c) => c.role === "EMPLOYE"
).length

const totalStagiaires = collaborators.filter(
(c) => c.role === "STAGIAIRE"
).length

const totalFreelances = collaborators.filter(
(c) => c.role === "FREELANCE"
).length
const statCards = [

{
title:"Collaborateurs",
value:totalCollaborateurs,
icon:Users
},

{
title:"Employés",
value:totalEmployes,
icon:User
},

{
title:"Stagiaires",
value:totalStagiaires,
icon:GraduationCap
},

{
title:"Freelances",
value:totalFreelances,
icon:Briefcase
},

]
  const roleLabels = {
    ADMIN: <Badge variant="default">Admin</Badge>,
    EMPLOYE: <Badge variant="secondary">Employé</Badge>,
    STAGIAIRE: <Badge variant="warning">Stagiaire</Badge>,
    FREELANCE: <Badge variant="outline">Freelance</Badge>,
  }

  return (
    <>
      <PageHeader
        icon={Users}
        title="Collaborateurs"
        subtitle="Gérez tous les collaborateurs de l'entreprise"
        action={
          <Link to="/admin/collaborators/create">
            <Button
    className="
    h-12
    px-8
    rounded-xl
    bg-[#2F67F6]
    hover:bg-[#1742A0]
    text-white
    shadow-lg
    transition-all
    duration-300
    gap-2
    "
>
    <UserPlus className="w-5 h-5" />
    Nouveau collaborateur
</Button>
          </Link>
        }
      />

      <div className="p-8">


{/* STATISTIQUES */}


<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
mb-8
"
>

{statCards.map((card)=>{

const Icon = card.icon

return(

<div

key={card.title}

className="
rounded-3xl
bg-white
shadow-md
p-6
border
border-slate-100
hover:shadow-xl
transition-all
duration-300
"

>

<div className="flex justify-between items-center">

<div>

<p
className="
text-slate-500
text-sm
font-medium
"
>

{card.title}

</p>


<h2
className="
text-4xl
font-bold
text-[#0F2557]
mt-3
"
>

{card.value}

</h2>

</div>


<div
className="
h-14
w-14
rounded-2xl
bg-[#DDE7FF]
flex
items-center
justify-center
"
>

<Icon
size={26}
className="text-[#2F67F6]"
/>

</div>


</div>


</div>

)

})}

</div>
        <div
className="
flex
flex-col
lg:flex-row
gap-5
mb-8
"
>

{/* RECHERCHE */}

<div className="relative flex-1">

<Search
size={20}
className="
absolute
left-4
top-1/2
-translate-y-1/2
text-slate-400
"
/>

<Input

placeholder="Rechercher un collaborateur ..."

value={searchTerm}

onChange={(e)=>
setSearchTerm(e.target.value)
}

className="
pl-12
h-14
rounded-2xl
border
border-slate-200
bg-white
shadow-sm
focus-visible:ring-[#2F67F6]
"

/>

</div>



{/* FILTRE */}


<div className="w-full lg:w-56">

<Select
value={roleFilter}
onValueChange={setRoleFilter}
>

<SelectTrigger

className="
h-14
rounded-2xl
border-slate-200
shadow-sm
"

>

<Filter className="mr-2 h-4 w-4"/>

<SelectValue
placeholder="Tous les rôles"
/>

</SelectTrigger>


<SelectContent>

<SelectItem value="ALL">
Tous les rôles
</SelectItem>

<SelectItem value="ADMIN">
Admin
</SelectItem>

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


</div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
          </div>
        ) : (
         <div
className="
rounded-3xl
bg-white
shadow-md
overflow-hidden
border
border-slate-100
"
>
            <Table>
              <TableHeader>

<TableRow className="bg-[#F7F9FD]">

<TableHead className="font-bold text-[#0F2557]">
Nom
</TableHead>

<TableHead className="font-bold text-[#0F2557]">
Email
</TableHead>

<TableHead className="font-bold text-[#0F2557]">
Rôle
</TableHead>

<TableHead className="font-bold text-[#0F2557]">
Contrat
</TableHead>

<TableHead className="font-bold text-[#0F2557]">
Actif
</TableHead>

<TableHead className="text-right font-bold text-[#0F2557]">
Actions
</TableHead>

</TableRow>

</TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-on-surface-variant">
                      Aucun collaborateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.first_name} {c.last_name}
                      </TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{roleLabels[c.role] || c.role}</TableCell>
                      <TableCell>{c.contract_type}</TableCell>
                      <TableCell>
                        <Switch
                          checked={c.is_active}
                          onCheckedChange={() => handleToggleActive(c.id, c.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">

<DropdownMenu>

<DropdownMenuTrigger asChild>

<Button
variant="ghost"
size="icon"
>

<MoreHorizontal
className="w-5 h-5"
/>

</Button>

</DropdownMenuTrigger>



<DropdownMenuContent
align="end"
className="w-52 rounded-xl"
>


<DropdownMenuItem

onClick={()=>
navigate(
`/admin/collaborators/${c.id}/edit`
)
}

>

<Pencil
className="mr-2 h-4 w-4"
/>

Modifier


</DropdownMenuItem>



<DropdownMenuItem

onClick={()=>
handleToggleActive(
c.id,
c.is_active
)
}

>

<UserX
className="mr-2 h-4 w-4"
/>


{c.is_active
?"Désactiver"
:"Activer"
}


</DropdownMenuItem>



<DropdownMenuSeparator />


<DropdownMenuItem

onClick={()=>
handleDelete(c.id)
}

className="
text-red-500
focus:text-red-500
"

>

<Trash2
className="mr-2 h-4 w-4"
/>

Supprimer

</DropdownMenuItem>


</DropdownMenuContent>

</DropdownMenu>


</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}

export default Collaborators