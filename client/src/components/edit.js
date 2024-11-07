import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    universe: "",
    group: "",
    price: "",
    photo: "",
    tag: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      try {
        const response = await fetch(`http://localhost:5000/record/${id}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          window.alert(`Record with id ${id} not found`);
          navigate("/admin");
          return;
        }
        console.log('Fetched record:', record);
        setForm(record);
        console.log('Form after setForm:', form); 
      } catch (error) {
        console.error('Error fetching data:', error);
        window.alert('Error fetching data');
      }
    }
    fetchData();
  }, [params.id, navigate]);

  // Обновление состояния формы
  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedProduct = {
      name: form.name,
      description: form.description,
      universe: form.universe,
      group: form.group,
      price: form.price,
      photo: form.photo,
      tag: form.tag,
    };

    try {
      const response = await fetch(`http://localhost:5000/update/${params.id}`, {
        method: "POST",
        body: JSON.stringify(editedProduct),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      navigate("/admin");
    } catch (error) {
      console.error("Failed to update the product:", error);
    }
  }

  return (
    <div className="container-admin">
      <h3>Update Record</h3>
      <form className="form-admin" onSubmit={onSubmit}>
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
        <br />
        <div className="form-group">
          <input
            type="submit"
            value="Update Product"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
