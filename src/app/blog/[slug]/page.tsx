// @ts-nocheck
import "server-only";
import { fetchPages, fetchPageBySlug } from "../../../lib/notion";
import { notFound } from "next/navigation";
import React from "react";
import Header from "../../components/Header";
import { headers } from 'next/headers';
import formatDate from '../../../utils/formatDate';
import DOMPurify from 'isomorphic-dompurify';

export default async function Blog(request) {
  const slug = request.params.slug;
  const post = await fetchPageBySlug(slug);
  const sanitizedHtml = DOMPurify.sanitize(post?.text?.rich_text[0].text.content);
  
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
        <header className="mb-20" id="skills">
          <p className="text-gray-400 text-sm">{formatDate({ date: post.created_time?.rich_text[0]?.plain_text, formatString: 'dd/MM/yyyy' })}</p>
          <h2 className="font-mono text-white font-bold text-4xl  md:text-4xl mb-1 md:pb-4">
            {post?.title.title[0].text.content}{" "}
          </h2>
          <hr className="border-b-4 border-orange-red mb-14 w-20" />
          <div className="font-mono text-white md:text-xl md:w-2/3 mb-8">
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </div>
          <a href="/blog" className="text-orange-red underline text-sm">voltar</a>
        </header>
      </main>
    </div>
  );
}
