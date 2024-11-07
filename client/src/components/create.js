import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Create() {
 const [form, setForm] = useState({
    
   name: "",
   description: "",
   universe: "",
   group: "",
   price: "",
   photo: "",
   tag: "",




 });
 const navigate = useNavigate();
  // Обновление состояния формы
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
  // Отправка данных на сервер.
 async function onSubmit(e) {
   e.preventDefault();
    // Добавление нового продукта в БД.
   const newProduct = { ...form };
    fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newProduct),
   })


    setForm({
    
    name: "",
    description: "",
    universe: "",
    group: "",
    price: "",
    photo: "",
    tag: "",
  });
   navigate("/admin");
 }
  // Собственно форма создания нового продукта.
 return (
   <div className="container-admin">
     <h3>Create New Record</h3>
     <form className="form-admin"onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="description">Description</label>
         <input
           type="text"
           className="form-control"
           id="description"
           value={form.description}
           onChange={(e) => updateForm({ description: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="universe">Universe</label>
         <input
           type="text"
           className="form-control"
           id="universe"
           value={form.universe}
           onChange={(e) => updateForm({ universe: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="group">Group</label>
         <input
           type="text"
           className="form-control"
           id="group"
           value={form.group}
           onChange={(e) => updateForm({ group: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="price">Price</label>
         <input
           type="text"
           className="form-control"
           id="price"
           value={form.price}
           onChange={(e) => updateForm({ price: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="photo">Photo</label>
         <input
           type="text"
           className="form-control"
           id="photo"
           value={form.photo}
           onChange={(e) => updateForm({ photo: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="tag">Tag</label>
         <input
           type="text"
           className="form-control"
           id="tag"
           value={form.tag}
           onChange={(e) => updateForm({ tag: e.target.value })}
         />
       </div>
       
       <div className="form-group">
         <input
           type="submit"
           value="Create product"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}