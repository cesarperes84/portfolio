// @ts-nocheck
"use client";
import React from "react";

const WebApps = () => (
  <section id="webapps" className="text-gray-300 mb-14">
    <div className="">
      <div className="mb-10 md:w-2/3">
        {/* <h2 className="text-2xl md:text-4xl font-bold font-mono text-orange-red">Web Apps</h2> */}
        {/* <hr className="border-b-4 border-orange-red mb-14 w-20" /> */}
        <p className="md:text-xl font-mono font-bold">WEB APPS</p>
      </div>
      <div className="flex flex-wrap gap-x-0 gap-y-4 font-mono w-full md:-ml-4">
        <div className="w-full md:w-1/3">
          <div
            onClick={() => window.open("http://street5.vercel.app", "_blank")}
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1732220224/portfolio/street5"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Web app que simula carro ao som de estações de
                  rádios. 2021
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
            onClick={() =>
              window.open("https://covid19-cperes.vercel.app/", "_blank")
            }
            className="portfolio-box"
          >
            <img
              src="https://res.cloudinary.com/dqaojtmfr/image/upload/v1709746358/portfolio/corona"
              className="img-responsive"
              alt=""
            />
            <div className="portfolio-box-caption">
              <div className="portfolio-box-caption-content">
                <div className="project-name">
                  Estatísticas diárias da COVID19 no Brasil. 2020
                </div>
                <div className="project-category text-faded">
                  NextJs, ReactJs, Amcharts, TypeScript, Material-UI, Axios
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WebApps;
