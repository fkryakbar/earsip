import{r as h,j as e,Y as p,y as f}from"./app-NzT8-67p.js";import{D as j}from"./DashboardLayout-DNe-pfRH.js";import{t as w,a as g,b as l,c as b,d as C,e as a,S as s}from"./sweetalert2.all-CI23OSos.js";import y from"./UpdateCategory-BmAwwFhi.js";import v from"./CreateCategory-C51Y5jB8.js";import{u as k}from"./index-Bi90DZsZ.js";import"./chunk-T5T2WLXQ-jg4JrHlp.js";import"./SelectionManager-DIr8UmK3.js";import"./chunk-P2T5LMDM-Dg-SZ9tb.js";import"./chunk-KBN3H6OQ-VcivWui7.js";function Y({categories:i}){const r=k(),[d,c]=h.useState(null),m=t=>{s.fire({title:"Are you sure?",text:"You won't be able to revert this! All files related to this category will be deleted",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete it!",showLoaderOnConfirm:!0,preConfirm:async o=>{try{await u(t)}catch(n){s.showValidationMessage(`
                    Request failed: ${n}
                  `)}},allowOutsideClick:()=>!s.isLoading()}).then(o=>{o.isConfirmed&&s.fire({title:"Deleted!",text:"Your category has been deleted.",icon:"success",confirmButtonColor:"#3085d6"})}).catch(()=>{s.fire({title:"Error!",text:"Failed to delete",icon:"error",confirmButtonText:"Cool"})})};function u(t){return new Promise((o,n)=>{f.delete(route("deleteKategori",{id:t}),{onSuccess:()=>{o()},onError:x=>{n(x)}})})}return e.jsxs(e.Fragment,{children:[e.jsx(p,{title:"Arsip",children:e.jsx("link",{href:"https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.css",rel:"stylesheet"})}),e.jsx(j,{children:e.jsxs("div",{className:"lg:w-[60%] w-[95%] mx-auto bg-white p-5 rounded shadow-md",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-600",children:"Kategori"}),e.jsx(y,{category:d,isOpen:r.isOpen,onOpenChange:r.onOpenChange,onClose:r.onClose}),e.jsx(v,{})]}),e.jsx("div",{className:"mt-3",children:e.jsxs(w,{"aria-label":"Tabel Arsip",removeWrapper:!0,children:[e.jsxs(g,{children:[e.jsx(l,{children:"Name"}),e.jsx(l,{className:"text-center",children:"Aksi"})]}),e.jsx(b,{items:i,emptyContent:"Tidak ada file",children:t=>e.jsxs(C,{children:[e.jsx(a,{children:e.jsx("p",{className:"line-clamp-1",children:t.name})}),e.jsxs(a,{className:"flex gap-2 items-center justify-center",children:[e.jsx("button",{onClick:()=>{r.onOpen(),c(t)},className:"text-xs bg-green-500 text-white p-1 rounded",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"size-4",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"})})}),e.jsx("button",{onClick:()=>m(t.id),className:"text-xs bg-red-500 text-white p-1 rounded",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"size-4",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"})})})]})]},t.id)})]})})]})})]})}export{Y as default};
