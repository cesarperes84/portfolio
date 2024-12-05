// @ts-nocheck
"use client";
import React from "react";

const WebSites = () => (
  <section id="websites" className="text-gray-300 mb-14">
    <div className="">
      <div className="mb-10 md:w-2/3">
        {/* <h2 className="text-2xl md:text-4xl font-bold font-mono text-orange-red">Websites</h2> */}
        {/* <hr className="border-b-4 border-orange-red mb-14 w-20" /> */}
        <p className="md:text-xl font-mono font-bold">WEB SITES</p>
      </div>
      <div className="flex flex-wrap gap-x-0 gap-y-4 font-mono w-full md:-ml-4">
      <div className="w-full md:w-1/3">
          <div
            onClick={() =>
              window.open("https://daily-games.vercel.app/", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/daily-games"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Agregador de jogos diários. 2023
                </div>
                <div className="project-category text-faded">
                  Layout, HTML, CSS, Javascript, NextJs, ReactJs, TailwindCss
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div
            onClick={() =>
              window.open("http://www.fortniteplayerstats.com", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/fortnite"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Estatísticas de jogadores do Fortinte. 2021
                </div>
                <div className="project-category text-faded">
                  Layout, HTML, CSS, Javascript, ReactJs, Bootstrap, Axios
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-full md:w-1/3">
          <div
            onClick={() =>
              window.open("http://wikibbb.vercel.app", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1732222291/portfolio/wiki-bbb"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Website de Busca de BBBs. 2021
                </div>
                <div className="project-category text-faded">
                Layout, HTML, CSS, Javascript, NextJs, ReactJs, TailwindCss, Firebase
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="w-full md:w-1/3">
          <div
            onClick={() =>
              window.open("http://www.esocomprar.com.br", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/esocomprar"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Website de Cupons de Descontos. 2012
                </div>
                <div className="project-category text-faded">
                  LAYOUT, HTML5, CSS, JQuery, PHP, MYSQL
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          <div
            onClick={() => window.open("http://www.dogwalk.com.br", "_blank")}
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/dogwalk"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Website que conecta passeadores de cães aos donos de pet. 2015
                </div>
                <div className="project-category text-faded">
                  HTML5, CSS, JQuery, PHP, MYSQL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WebSites;
