import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Record = (props) => (
 <tr>
   <td>{props.record.name}</td>
   <td>{props.record.description}</td>
   <td>{props.record.universe}</td>
   <td>{props.record.group}</td>
   <td>{props.record.price}</td>
   <td>{props.record.photo}</td>
   <td>{props.record.tag}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.record._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
);
export default function RecordList() {
 const [records, setRecords] = useState([]);
  
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/record/`);
      if (!response.ok) {
       const message = `Error: ${response.statusText}`;
       window.alert(message);
       return;
     }
      const records = await response.json();
     setRecords(records);
   }
    getRecords();
    return;
 }, [records.length]);
  // Удаление записи
 async function deleteRecord(id) {
  console.log("deleteRecord");
  fetch(`http://localhost:5000/${id}`, {
     method: "DELETE"
   });
  
   
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
   
 
 }
  // Отображение записей
 function recordList() {
   return records.map((record) => {
     return (
       <Record
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />
     );
   });
 }
  // Рендер.
 return (
   <div className="container-admin" >
     <Link className="btn btn-link" to={`/create`}>Створити</Link> |
     <h3>Record List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Description</th>
           <th>Universe</th>
           <th>Group</th>
           <th>Price</th>
           <th>Photo</th>
           <th>Tag</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
   </div>
 );
}