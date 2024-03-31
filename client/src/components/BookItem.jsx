import { useEffect, useState } from "react";
import { BiBarcodeReader } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import { CiPen } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function BookItem({ book }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/get-book/${book.id}`}>
        <img
          src={
            "https://img.freepik.com/free-psd/3d-rendering-back-school-icon_23-2149589337.jpg?size=626&ext=jpg"
          }
          alt="book cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="justify-center items-center p-5">
          <p className="text-bold text-2xl">{book.title}</p>
          <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
            <BiBarcodeReader className="text-blue-400 text-xl" />
            {book.isbn}
          </p>
          <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
            <CiPen className="text-blue-400 text-xl" />
            {book.author}
          </p>
          <p className="flex items-center mt-1 gap-2 text-slate-600  text-sm">
            <MdDateRange className="text-blue-400 text-xl" />
            {book.publicationYear}
          </p>
        </div>
      </Link>
    </div>
  );
}
