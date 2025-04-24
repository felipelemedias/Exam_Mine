import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const HeroSection = (): JSX.Element => {
  // Feature list data for mapping
  const featureList = [
    "Encontre informações sobre medicamentos com facilidade",
    "Compare preços, leia bulas e saiba mais sobre posologia, contraindicações e efeitos colaterais.",
    "Desenvolvido com inteligência artificial avançada para acesso rápido e confiável.",
    "Informações de farmácias e bulas para decisões mais seguras",
  ];

  return (
    <section className="w-full max-w-[1312px] h-auto py-16 px-8 mx-auto bg-[#e8f0fa] rounded-[36px]">
      <div className="flex flex-col md:flex-row gap-8 justify-between">
        {/* Left side - Illustration */}
        <div className="w-full md:w-[490px]">
          <Card className="h-[402px] rounded-lg overflow-hidden shadow-[0px_2px_10px_#00507d14] border-0">
            <CardContent className="p-0">
              <div className="relative w-full h-[429px] -top-[13px] -left-[5px]">
                <img
                  className="absolute w-[354px] h-[364px] top-8 left-[87px]"
                  alt="Path"
                  src="/path-1-1.svg"
                />

                <img
                  className="absolute w-[421px] h-[429px] top-0 left-0"
                  alt="Path"
                  src="/path-1.svg"
                />

                <div className="absolute w-[163px] h-[228px] top-[152px] left-[22px]">
                  <div className="relative h-[228px]">
                    <div className="absolute w-[66px] h-3 top-[52px] left-5 rotate-[-23.26deg] [background:linear-gradient(210deg,rgba(170,134,93,1)_0%,rgba(166,113,51,1)_100%)]" />

                    <img
                      className="absolute w-[101px] h-[61px] top-[51px] left-[17px]"
                      alt="Path"
                      src="/path-2.svg"
                    />

                    <div className="absolute w-[109px] h-[117px] top-[85px] left-9 rotate-[-23.26deg] [background:linear-gradient(268deg,rgba(170,134,93,1)_0%,rgba(166,113,51,1)_100%)]" />

                    <img
                      className="absolute w-[100px] h-[52px] top-44 left-[63px]"
                      alt="Path"
                      src="/path-3.svg"
                    />

                    <div className="absolute w-[109px] h-[93px] top-[99px] left-9 rotate-[-23.26deg] [background:linear-gradient(255deg,rgba(231,198,198,1)_0%,rgba(237,214,214,1)_25%,rgba(247,236,236,1)_52%,rgba(253,250,250,1)_80%,rgba(255,255,255,1)_100%)]" />

                    <img
                      className="absolute w-[45px] h-[38px] top-[51px] left-[81px]"
                      alt="Path"
                      src="/path-4.svg"
                    />

                    <div className="absolute w-[66px] h-1.5 top-[54px] left-5 rotate-[156.74deg] [background:linear-gradient(0deg,rgba(170,134,93,1)_0%,rgba(166,113,51,1)_100%)]" />

                    <div className="absolute w-1.5 h-[5px] top-12 left-[79px] bg-white rotate-[156.74deg] opacity-20" />

                    <img
                      className="absolute w-20 h-[165px] top-[63px] left-[17px]"
                      alt="Path"
                      src="/path-5.svg"
                    />

                    <div className="absolute w-[25px] h-[3px] top-24 left-10 bg-white rounded-[1.52px] rotate-[156.74deg] opacity-10" />

                    <div className="absolute w-[25px] h-[3px] top-[202px] left-[86px] bg-white rounded-[1.52px] rotate-[156.74deg] opacity-10" />

                    <div className="absolute w-2 h-[3px] top-[85px] left-[76px] bg-white rounded-[1.52px] rotate-[156.74deg] opacity-10" />

                    <img
                      className="absolute w-[107px] h-[174px] top-10 left-14"
                      alt="Path"
                      src="/path-6.svg"
                    />

                    <img
                      className="absolute w-[86px] h-[68px] top-0 left-0"
                      alt="Path"
                      src="/path-7-1.svg"
                    />

                    <img
                      className="absolute w-[73px] h-[33px] top-[31px] left-3"
                      alt="Path"
                      src="/path-8-1.svg"
                    />

                    <img
                      className="absolute w-1.5 h-[9px] top-0 left-16"
                      alt="Path"
                      src="/path-9-1.svg"
                    />

                    <div className="absolute w-0.5 h-2.5 top-0.5 left-[62px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[3px] left-[57px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[5px] left-[53px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[7px] left-12 rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[9px] left-11 rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[11px] left-10 rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[13px] left-[35px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[15px] left-[31px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[17px] left-[26px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[19px] left-[22px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-5 left-[18px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-[22px] left-[13px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <div className="absolute w-0.5 h-2.5 top-6 left-[9px] rotate-[-23.26deg] [background:linear-gradient(90deg,rgba(231,198,198,0.3)_0%,rgba(237,214,214,0.3)_24%,rgba(247,236,236,0.3)_47%,rgba(253,250,250,0.3)_75%,rgba(255,255,255,0.3)_100%)]" />

                    <img
                      className="absolute w-1.5 h-2.5 top-[26px] left-[3px]"
                      alt="Path"
                      src="/path-10-1.svg"
                    />

                    <div className="absolute w-[25px] h-[25px] top-[122px] left-[41px] rounded-[12.7px] [background:linear-gradient(49deg,rgba(255,202,202,1)_0%,rgba(231,151,150,1)_100%)]" />

                    <img
                      className="absolute w-[17px] h-[17px] top-[127px] left-[46px]"
                      alt="Path"
                      src="/path-11-1.svg"
                    />

                    <div className="absolute w-[33px] h-[18px] top-[118px] left-[92px]">
                      <div className="relative h-[18px]">
                        <img
                          className="absolute w-[5px] h-1.5 top-3 left-0"
                          alt="Path"
                          src="/path-12-1.svg"
                        />

                        <img
                          className="absolute w-[5px] h-[5px] top-[11px] left-1"
                          alt="Path"
                          src="/path-13-1.svg"
                        />

                        <img
                          className="absolute w-1 h-[5px] top-2 left-2"
                          alt="Path"
                          src="/path-14-1.svg"
                        />

                        <img
                          className="absolute w-[3px] h-1.5 top-[7px] left-[11px]"
                          alt="Path"
                          src="/path-15-1.svg"
                        />

                        <img
                          className="absolute w-[5px] h-1.5 top-1.5 left-[13px]"
                          alt="Path"
                          src="/path-16-1.svg"
                        />

                        <img
                          className="absolute w-[3px] h-1.5 top-1 left-[17px]"
                          alt="Path"
                          src="/path-15-1.svg"
                        />

                        <img
                          className="absolute w-1 h-1 top-1 left-5"
                          alt="Path"
                          src="/path-18-1.svg"
                        />

                        <img
                          className="absolute w-1 h-[5px] top-0.5 left-[23px]"
                          alt="Path"
                          src="/path-14-1.svg"
                        />

                        <img
                          className="absolute w-[3px] h-1.5 top-0 left-[26px]"
                          alt="Path"
                          src="/path-15-1.svg"
                        />

                        <img
                          className="absolute w-1 h-1 top-0 left-[29px]"
                          alt="Path"
                          src="/path-21-1.svg"
                        />
                      </div>
                    </div>

                    <div className="absolute w-[74px] h-1 top-[146px] left-[59px] rounded-[1.77px] rotate-[156.74deg] [background:linear-gradient(0deg,rgba(170,134,93,1)_0%,rgba(166,113,51,1)_100%)]" />

                    <div className="absolute w-[74px] h-1 top-[156px] left-[63px] rounded-[1.77px] rotate-[156.74deg] [background:linear-gradient(0deg,rgba(170,134,93,1)_0%,rgba(166,113,51,1)_100%)]" />

                    <div className="absolute w-[74px] h-1 top-[165px] left-[67px] rounded-[1.77px] rotate-[156.74deg] [background:linear-gradient(0deg,rgba(170,134,93,1)_0%,rgba(166,113,51,1)_100%)]" />

                    <img
                      className="absolute w-3.5 h-[68px] top-16 left-[17px]"
                      alt="Path"
                      src="/path-22-1.svg"
                    />

                    <img
                      className="absolute w-[62px] h-[67px] top-0 left-6"
                      alt="Path"
                      src="/path-23-1.svg"
                    />
                  </div>
                </div>

                <img
                  className="absolute w-2.5 h-[15px] top-[126px] left-28"
                  alt="Path"
                  src="/path-24.svg"
                />

                <div className="absolute w-[108px] h-28 top-[13px] left-[322px]">
                  <div className="relative h-28">
                    <img
                      className="absolute w-[85px] h-[107px] top-0 left-[23px]"
                      alt="Path"
                      src="/path-25-1.svg"
                    />

                    <img
                      className="absolute w-[98px] h-[107px] top-[5px] left-0"
                      alt="Group"
                      src="/group-3.png"
                    />

                    <img
                      className="absolute w-[71px] h-[68px] top-[39px] left-px"
                      alt="Path"
                      src="/path-27-1.svg"
                    />

                    <div className="absolute w-16 h-[66px] top-7 left-[13px]">
                      <div className="relative h-[66px]">
                        <img
                          className="absolute w-[23px] h-[7px] top-3.5 left-px"
                          alt="Path"
                          src="/path-28-1.svg"
                        />

                        <img
                          className="absolute w-3 h-[21px] top-[45px] left-[38px]"
                          alt="Path"
                          src="/path-29-1.svg"
                        />

                        <img
                          className="absolute w-[30px] h-2 top-0 left-4"
                          alt="Path"
                          src="/path-30-1.svg"
                        />

                        <img
                          className="absolute w-3 h-5 top-[3px] left-9"
                          alt="Path"
                          src="/path-31-1.svg"
                        />

                        <img
                          className="absolute w-[23px] h-2.5 top-[17px] left-[39px]"
                          alt="Path"
                          src="/path-32-1.svg"
                        />

                        <img
                          className="absolute w-[54px] h-[61px] top-[5px] left-0"
                          alt="Group"
                          src="/group-4.png"
                        />

                        <img
                          className="absolute w-3 h-[31px] top-[21px] left-[52px]"
                          alt="Path"
                          src="/path-34-1.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <img
                  className="absolute w-[39px] h-[33px] top-[95px] left-12"
                  alt="Group"
                  src="/group-7.png"
                />

                <img
                  className="absolute w-[23px] h-6 top-[127px] left-[98px]"
                  alt="Group"
                  src="/group-8.png"
                />

                <img
                  className="absolute w-2.5 h-[15px] top-[114px] left-[141px]"
                  alt="Path"
                  src="/path-46.svg"
                />

                <img
                  className="absolute w-[23px] h-6 top-[114px] left-[142px]"
                  alt="Group"
                  src="/group-9.png"
                />

                <img
                  className="absolute w-[52px] h-[42px] top-[27px] left-[86px]"
                  alt="Group"
                  src="/group-10.png"
                />

                <img
                  className="absolute w-[89px] h-[46px] top-[132px] left-[188px]"
                  alt="Group"
                  src="/group-11.png"
                />

                <img
                  className="absolute w-[109px] h-[105px] top-[247px] left-[148px]"
                  alt="Group"
                  src="/group-12.png"
                />

                <img
                  className="absolute w-[55px] h-[53px] top-[187px] left-[241px]"
                  alt="Group"
                  src="/group-13.png"
                />

                <img
                  className="absolute w-[237px] h-[264px] top-[151px] left-[241px]"
                  alt="Group"
                  src="/group-14.png"
                />

                <div className="absolute w-[7px] h-[7px] top-[113px] left-[119px] rounded-[3.34px] [background:linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(234,216,216,1)_99%)]" />

                <div className="absolute w-[5px] h-[5px] top-[101px] left-32 rounded-[2.47px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(231,151,150,1)_0%,rgba(220,105,99,1)_100%)]" />

                <div className="absolute w-[5px] h-[5px] top-24 left-[115px] rounded-[2.47px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(231,151,150,1)_0%,rgba(220,105,99,1)_100%)]" />

                <img
                  className="absolute w-[147px] h-[168px] top-[225px] left-[295px]"
                  alt="Rectangle"
                  src="/rectangle-35.svg"
                />

                <div className="absolute w-[98px] h-[86px] top-[19px] left-[172px]">
                  <div className="relative h-[86px]">
                    <img
                      className="absolute w-[63px] h-16 top-0 left-0"
                      alt="Path"
                      src="/path-81.svg"
                    />

                    <img
                      className="absolute w-[42px] h-[35px] top-[29px] left-0"
                      alt="Path"
                      src="/path-82-1.svg"
                    />

                    <img
                      className="absolute w-[52px] h-[30px] top-0.5 left-2"
                      alt="Path"
                      src="/path-84.svg"
                    />

                    <img
                      className="absolute w-[59px] h-[39px] top-0 left-1"
                      alt="Path"
                      src="/path-85.svg"
                    />

                    <img
                      className="absolute w-[45px] h-6 top-0 left-[18px]"
                      alt="Path"
                      src="/path-86-1.svg"
                    />

                    <img
                      className="absolute w-[62px] h-[70px] top-4 left-9"
                      alt="Path"
                      src="/path-87-1.svg"
                    />

                    <img
                      className="absolute w-10 h-14 top-[25px] left-[51px]"
                      alt="Path"
                      src="/path-88-1.svg"
                    />

                    <img
                      className="absolute w-[35px] h-[18px] top-[52px] left-[45px]"
                      alt="Group"
                      src="/group-15.png"
                    />

                    <img
                      className="absolute w-[23px] h-[29px] top-[31px] left-[47px]"
                      alt="Group"
                      src="/group-16.png"
                    />

                    <img
                      className="absolute w-[45px] h-[42px] top-11 left-9"
                      alt="Path"
                      src="/path-103-1.svg"
                    />

                    <img
                      className="absolute w-[42px] h-[62px] top-[22px] left-11"
                      alt="Path"
                      src="/path-104-1.svg"
                    />

                    <img
                      className="absolute w-[39px] h-[60px] top-[25px] left-[59px]"
                      alt="Path"
                      src="/path-105-1.svg"
                    />
                  </div>
                </div>

                <img
                  className="absolute w-8 h-[29px] top-[85px] left-[235px]"
                  alt="Group"
                  src="/group-18.png"
                />

                <img
                  className="absolute w-[34px] h-[25px] top-[95px] left-[282px]"
                  alt="Group"
                  src="/group-19.png"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-[500px] flex flex-col gap-4">
          {/* Title section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-8 h-8">
                <div className="relative w-[23px] h-[27px] top-[3px] left-[5px] bg-[url(/vector-7.svg)] bg-[100%_100%]">
                  <div className="relative w-5 h-[22px] top-1 left-0.5">
                    <div className="absolute w-[17px] h-4 top-0 left-0 rotate-180">
                      <div className="relative h-4">
                        <div className="absolute w-[17px] h-3.5 top-0 left-0">
                          <div className="relative h-3.5">
                            <img
                              className="absolute w-[11px] h-[11px] top-0 left-1.5"
                              alt="Path"
                              src="/path-81-1.svg"
                            />

                            <img
                              className="absolute w-[7px] h-1.5 top-[5px] left-[9px]"
                              alt="Path"
                              src="/path-82.svg"
                            />

                            <img
                              className="absolute w-[9px] h-[5px] top-0 left-[7px]"
                              alt="Path"
                              src="/path-84-1.svg"
                            />

                            <img
                              className="absolute w-2.5 h-[7px] top-0 left-1.5"
                              alt="Path"
                              src="/path-85-1.svg"
                            />

                            <img
                              className="absolute w-2 h-1 top-0 left-1.5"
                              alt="Path"
                              src="/path-86.svg"
                            />

                            <img
                              className="absolute w-2.5 h-3 top-[3px] left-0"
                              alt="Path"
                              src="/path-87.svg"
                            />

                            <img
                              className="absolute w-[7px] h-[9px] top-1 left-px"
                              alt="Path"
                              src="/path-88.svg"
                            />

                            <img
                              className="absolute w-1.5 h-[3px] top-[9px] left-[3px]"
                              alt="Group"
                              src="/group-15-1.png"
                            />

                            <img
                              className="absolute w-1 h-[5px] top-[5px] left-[5px]"
                              alt="Group"
                              src="/group-16-1.png"
                            />

                            <img
                              className="absolute w-2 h-[7px] top-[7px] left-[3px]"
                              alt="Path"
                              src="/path-103.svg"
                            />

                            <img
                              className="absolute w-[7px] h-2.5 top-1 left-0.5"
                              alt="Path"
                              src="/path-104.svg"
                            />

                            <img
                              className="absolute w-[7px] h-2.5 top-1 left-0"
                              alt="Path"
                              src="/path-105.svg"
                            />
                          </div>
                        </div>

                        <img
                          className="absolute w-[5px] h-[5px] top-[11px] left-px"
                          alt="Group"
                          src="/group-18-1.png"
                        />
                      </div>
                    </div>

                    <img
                      className="absolute w-2 h-[9px] top-[13px] left-3"
                      alt="Vector"
                      src="/vector-9.svg"
                    />
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg text-[#375375] leading-7">
                Buscar Remédio
              </h3>
            </div>

            <h2 className="font-bold text-[32px] text-[#375375] leading-[44px]">
              Mais que uma busca: apoio ao seu tratamento e saúde
            </h2>
          </div>
          {/* Feature list */}
          <div className="space-y-2.5 mb-6">
            {featureList.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <img
                  className="w-3.5 h-3.5 mt-1"
                  alt="Bullet point"
                  src={`/mask-group-${index === 0 ? "1" : index === 1 ? "2" : index === 2 ? "14" : "5"}.svg`}
                />
                <p className="text-base text-[#375375] leading-6">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button className="w-[243px] h-[42px] bg-[#1760c6] rounded-full text-white text-sm font-semibold hover:bg-[#1253af]">
            Explorar Busca de Remédios
          </Button>
        </div>
      </div>
    </section>
  );
};
