// @ts-nocheck
"use client";
import React from "react";

const Games = () => (
  <section id="games" className="text-gray-300 mb-14">
    <div className="">
      <div className="mb-10 md:w-2/3">
        <h2 className="text-2xl md:text-4xl font-bold font-mono text-orange-red">
          Projetos
        </h2>
        <hr className="border-b-4 border-orange-red mb-14 w-20" />
        <p className="md:text-xl font-mono font-bold">GAMES</p>
      </div>
      <div className="flex flex-wrap gap-x-0 gap-y-4 font-mono w-full md:-ml-4">
        
        {/* <div className="w-full md:w-1/3">
          <div
            onClick={() => window.open("/bullet/index.html", "_blank")}
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1733882189/portfolio/bullet"
              className="img-responsive"
              alt="Connnect.io"
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Web game para acertar o alvo que gira descontroladamente. 2021
                </div>
                <div className="project-category text-faded">
                  Layout, HTML, CSS, Javascript, Canvas
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="w-full md:w-1/3">
          <div
            onClick={() => window.open("/8bit-pong/index.html", "_blank")}
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1732219610/portfolio/pong-8bit"
              className="img-responsive"
              alt="8bit Pong"
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">Pong 8 BIT. 2022</div>
                <div className="project-category text-faded">
                  Layout, HTML, CSS, Javascript, Canvas
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="w-full md:w-1/3">
          <div
            onClick={() =>
              window.open("https://connectio.vercel.app/", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746737/portfolio/connect-io"
              className="img-responsive"
              alt="Connnect.io"
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Web game "conecte os caminhos". 2022
                </div>
                <div className="project-category text-faded">
                  Layout, NextJs, ReactJs, TypeScript, Material-UI
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div
            onClick={() =>
              window.open("https://novel-app-web.vercel.app/", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746737/portfolio/novel"
              className="img-responsive"
              alt="Novel"
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Game quiz "qual a novela do dia". 2022
                </div>
                <div className="project-category text-faded">
                  NextJs, ReactJs, TypeScript, Material-UI, Axios
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div
            onClick={() => window.open("https://www.decoddr.cc/", "_blank")}
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746737/portfolio/decoddr"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Mobile game diário "quebre a senha". 2022
                </div>
                <div className="project-category text-faded">
                  Layout, NextJs, ReactJs, TypeScript, Material-UI, Axios
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div
            onClick={() => window.open("bee/index.html", "_blank")}
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/bee"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Web game inspirado no Flappy Bird. 2014
                </div>
                <div className="project-category text-faded">
                  Layout, HTML, CSS, Javascript, Canvas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Games;
