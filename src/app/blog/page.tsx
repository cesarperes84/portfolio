// @ts-nocheck
import "server-only";
import { fetchPages, fetchPageBlocks, fetchPageBySlug } from "../../lib/notion";
import { notFound } from "next/navigation";
import React from "react";
import Header from "../components/Header";
import formatDate from '../../utils/formatDate';

export default async function Blog() {
  const pages = await fetchPages();
  const results = pages?.results;
  
  return (
    <div className="md:flex md:h-screen">
      <Header />
      <main
        className="sm:w-full md:w-4/5 px-4 md:px-16 py-12 bg-black scroll-smooth"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,34,34,0), rgba(0,0,0,0)), url(https://res.cloudinary.com/dqaojtmfr/image/upload/v1709747084/portfolio/4NB4.gif)",
          backgroundPosition: "top right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "600px 800px",
          overflowY: "auto",
        }}
      >
        <section className="text-gray-300 mb-14">
          <div className="mb-8 md:w-2/3 mb-50 ">
            <h2 className="text-2xl md:text-4xl font-bold font-mono text-orange-red">
              Blog
            </h2>
            <hr className="border-b-4 border-orange-red mb-14 w-20" />
            <p className="md:text-xl font-mono">
              Aqui você vai encontrar alguns textos que escrevi recentemente
            </p>
          </div>
        </section>
        <section className="mb-14">
          <div className="flex flex-wrap gap-x-8 gap-y-8 font-mono w-full md:-ml-4 pt-2">
            {results.map(({ properties }) => (
              <div className="w-full md:w-[768px]">
                <div className="box">
                  <p className="text-gray-400 text-sm">{formatDate({ date: properties.created_time?.rich_text[0]?.plain_text, formatString: 'dd/MM/yyyy' })}</p>
                  <h3 className="text-white md:text-xl">{properties.title?.title[0].text.content}</h3>
                  <hr className="border-b-2 border-white w-20" />
                  <div className="text-gray-400 mt-8">
                    <div className="mb-4 truncate" >{properties.description?.rich_text[0].plain_text}</div>
                    <div className="text-right">
                      <a href={`blog/${properties.slug.rich_text[0].plain_text}`} className="text-orange-red underline text-sm" >
                        Ver mais
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
