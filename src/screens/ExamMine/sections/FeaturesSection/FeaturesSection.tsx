import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const FeaturesSection = (): JSX.Element => {
  // Feature list data for mapping
  const features = [
    {
      id: 1,
      text: "Acesse informações detalhadas e atualizadas sobre medicamentos",
      icon: "/mask-group-19.svg",
    },
    {
      id: 2,
      text: "Saiba mais sobre posologia, contraindicações e efeitos colaterais",
      icon: "/mask-group-12.svg",
    },
    {
      id: 3,
      text: "Dados confiáveis para um uso seguro e informado",
      icon: "/mask-group-3.svg",
    },
    {
      id: 4,
      text: "Inclui bulas de diversos medicamentos",
      icon: "/mask-group-15.svg",
    },
  ];

  return (
    <Card className="w-full max-w-[1312px] mx-auto my-8 bg-[#f0fcf8] rounded-[36px] p-6">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left content section */}
          <div className="flex-1 max-w-[500px]">
            {/* Title section */}
            <div className="flex items-center gap-2 mb-14">
              <div className="relative w-8 h-8">
                <div className="absolute w-[22px] h-[5px] top-[13px] left-1 bg-[url(/group-24.png)] bg-[100%_100%]" />
                <div className="absolute w-[22px] h-[5px] top-[13px] left-1 bg-[url(/group-25.png)] bg-[100%_100%]" />
                <div className="absolute w-[30px] h-[30px] top-0 left-0 bg-[url(/group-26.png)] bg-[100%_100%]" />
              </div>
              <h3 className="font-bold text-xl text-[#375375] font-['Open_Sans',Helvetica] whitespace-nowrap">
                Consultar bula
              </h3>
            </div>

            {/* Main heading */}
            <h2 className="text-[32px] font-bold text-[#375375] leading-[44px] mb-12 font-['Inter',Helvetica] max-w-[422px]">
              Consulte Bulas de Medicamentos de Forma Rápida e Completa
            </h2>

            {/* Feature list */}
            <div className="space-y-6 mb-12">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-[22px]">
                  <img
                    className="w-3.5 h-3.5 mt-1.5"
                    alt="Check icon"
                    src={feature.icon}
                  />
                  <span className="text-base text-[#375375] font-['Inter',Helvetica]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button className="bg-[#64d8b7] hover:bg-[#50c6a5] text-white rounded-full h-[42px] px-6 font-semibold text-sm">
              Explore a Consulta de Bula
            </Button>
          </div>

          {/* Right illustration section */}
          <div className="flex-1 max-w-[543px] h-[541px] relative overflow-hidden">
            <div className="relative h-[492px] mt-[25px]">
              {/* Background elements */}
              <img
                className="absolute w-[494px] h-[53px] top-[439px] left-[49px]"
                alt="Path"
                src="/path-47.svg"
              />
              <img
                className="absolute w-[458px] h-[396px] top-0 left-[51px]"
                alt="Path"
                src="/path.svg"
              />

              {/* Layered graphics */}
              <div className="absolute w-[413px] h-[326px] top-2.5 left-[68px] opacity-50">
                <img
                  className="absolute w-[411px] h-[307px] top-[19px] left-0"
                  alt="Group"
                  src="/group.png"
                />
                <img
                  className="absolute w-[407px] h-[247px] top-[22px] left-[5px]"
                  alt="Group"
                  src="/group-1.png"
                />
                <img
                  className="absolute w-[402px] h-[325px] top-0 left-[11px]"
                  alt="Group"
                  src="/group-2.png"
                />
              </div>

              {/* Left side elements */}
              <div className="absolute w-[147px] h-[215px] top-[237px] left-0">
                <div className="absolute w-[61px] h-[187px] top-0 left-[86px]">
                  <img
                    className="absolute w-[61px] h-[142px] top-0 left-0"
                    alt="Group"
                    src="/group-6.png"
                  />
                  <img
                    className="absolute w-[51px] h-[182px] top-[5px] left-[5px]"
                    alt="Path"
                    src="/path-17.svg"
                  />
                </div>
                <div className="absolute w-[99px] h-[133px] top-[51px] left-0">
                  <img
                    className="absolute w-[89px] h-[106px] top-0 left-0"
                    alt="Group"
                    src="/group-17.png"
                  />
                  <img
                    className="absolute w-[95px] h-32 top-[5px] left-1"
                    alt="Path"
                    src="/path-38.svg"
                  />
                </div>
                <img
                  className="absolute w-[84px] h-[101px] top-[114px] left-[63px]"
                  alt="Group"
                  src="/group-5.png"
                />
              </div>

              {/* Central elements */}
              <div className="absolute w-[513px] h-[451px] top-[33px] left-[21px]">
                {/* Computer/device illustration */}
                <div className="absolute w-[513px] h-[285px] top-[166px] left-0">
                  <div className="absolute w-[381px] h-[253px] top-0 left-[81px]">
                    <div className="absolute w-[324px] h-[218px] top-0 left-[29px] bg-[url(/shape.svg)] bg-[100%_100%]">
                      <div className="absolute w-[303px] h-[177px] top-[15px] left-2.5 bg-[url(/path-7.svg)] bg-[100%_100%]">
                        <img
                          className="absolute w-[303px] h-[177px] top-0 left-0"
                          alt="Path"
                          src="/path-10.svg"
                        />
                        <div className="absolute w-[61px] h-[70px] top-[17px] left-[22px]">
                          <img
                            className="absolute w-3 h-[25px] top-[25px] left-[29px]"
                            alt="Path"
                            src="/path-15.svg"
                          />
                          <img
                            className="absolute w-[61px] h-[70px] top-0 left-0"
                            alt="Shape"
                            src="/shape-3.svg"
                          />
                        </div>
                        <img
                          className="absolute w-[178px] h-32 top-[33px] left-[102px]"
                          alt="Group"
                          src="/group-21.png"
                        />
                      </div>
                      <img
                        className="absolute w-2.5 h-2.5 top-0.5 left-[157px]"
                        alt="Oval"
                        src="/oval.svg"
                      />
                      <img
                        className="absolute w-[17px] h-[17px] top-[196px] left-[154px]"
                        alt="Oval"
                        src="/oval.svg"
                      />
                    </div>
                    <div className="absolute w-[381px] h-[34px] top-[218px] left-0 bg-[url(/path-51.svg)] bg-[100%_100%]">
                      <img
                        className="absolute w-[46px] h-[11px] top-[5px] left-[167px]"
                        alt="Path"
                        src="/path-8.svg"
                      />
                      <img
                        className="absolute w-[381px] h-[34px] top-0 left-0"
                        alt="Path"
                        src="/path-11.svg"
                      />
                    </div>
                  </div>

                  {/* Overlapping device */}
                  <div className="absolute w-[381px] h-[252px] top-0 left-[81px]">
                    <div className="absolute w-[324px] h-[218px] top-0 left-[29px] bg-[url(/shape-2.svg)] bg-[100%_100%]">
                      <div className="absolute w-[303px] h-[177px] top-[15px] left-2.5 bg-[url(/path-7.svg)] bg-[100%_100%]">
                        <img
                          className="absolute w-[303px] h-[177px] top-0 left-0"
                          alt="Path"
                          src="/path-10.svg"
                        />
                        <div className="absolute w-[61px] h-[70px] top-[17px] left-[22px]">
                          <img
                            className="absolute w-3 h-[25px] top-[26px] left-[29px]"
                            alt="Path"
                            src="/path-15.svg"
                          />
                          <img
                            className="absolute w-[61px] h-[70px] top-0 left-0"
                            alt="Shape"
                            src="/shape-3.svg"
                          />
                        </div>
                        <img
                          className="absolute w-[178px] h-32 top-[33px] left-[102px]"
                          alt="Group"
                          src="/group-22.png"
                        />
                      </div>
                      <img
                        className="absolute w-2.5 h-2.5 top-0.5 left-[157px]"
                        alt="Oval"
                        src="/oval.svg"
                      />
                      <img
                        className="absolute w-[17px] h-[17px] top-[196px] left-[154px]"
                        alt="Oval"
                        src="/oval.svg"
                      />
                    </div>
                    <div className="absolute w-[381px] h-[34px] top-[218px] left-0 bg-[url(/path-9.svg)] bg-[100%_100%]">
                      <img
                        className="absolute w-[46px] h-[11px] top-[5px] left-[167px]"
                        alt="Path"
                        src="/path-8.svg"
                      />
                      <img
                        className="absolute w-[381px] h-[34px] top-0 left-0"
                        alt="Path"
                        src="/path-12.svg"
                      />
                    </div>
                  </div>

                  {/* Right side character */}
                  <div className="absolute w-[202px] h-[281px] top-1 left-[311px]">
                    <img
                      className="w-[151px] h-[238px] top-[11px] absolute left-0"
                      alt="Shape"
                      src="/shape-1.svg"
                    />
                    <img
                      className="absolute w-[11px] h-2.5 top-[261px] left-[141px]"
                      alt="Path"
                      src="/path-41.svg"
                    />
                    <img
                      className="absolute w-[23px] h-2.5 top-[264px] left-[132px]"
                      alt="Path"
                      src="/path-45.svg"
                    />
                    <img
                      className="absolute w-[59px] h-[82px] top-[183px] left-[117px]"
                      alt="Path"
                      src="/path-48.svg"
                    />
                    <img
                      className="absolute w-3 h-[9px] top-[267px] left-[100px]"
                      alt="Path"
                      src="/path-20.svg"
                    />
                    <img
                      className="absolute w-[23px] h-2 top-[270px] left-[90px]"
                      alt="Path"
                      src="/path-42.svg"
                    />
                    <img
                      className="absolute w-[58px] h-[81px] top-[188px] left-[99px]"
                      alt="Path"
                      src="/path-25.svg"
                    />
                    <img
                      className="absolute w-[51px] h-[101px] top-[98px] left-[133px]"
                      alt="Path"
                      src="/path-16.svg"
                    />
                    <img
                      className="absolute w-4 h-[13px] top-[89px] left-[149px]"
                      alt="Path"
                      src="/path-22.svg"
                    />
                    <img
                      className="absolute w-6 h-[27px] top-[68px] left-[142px]"
                      alt="Path"
                      src="/path-29.svg"
                    />
                    <img
                      className="absolute w-6 h-[27px] top-[68px] left-[142px]"
                      alt="Path"
                      src="/path-18.svg"
                    />
                    <img
                      className="absolute w-[30px] h-[34px] top-[62px] left-[139px]"
                      alt="Path"
                      src="/path-49.svg"
                    />
                    <img
                      className="absolute w-[76px] h-[71px] top-[148px] left-[126px]"
                      alt="Path"
                      src="/path-39.svg"
                    />
                    <img
                      className="absolute w-[76px] h-[71px] top-[148px] left-[126px]"
                      alt="Path"
                      src="/path-23.svg"
                    />
                    <img
                      className="absolute w-[21px] h-[66px] top-[215px] left-[127px]"
                      alt="Path"
                      src="/path-19.svg"
                    />
                    <img
                      className="absolute w-3.5 h-[59px] top-[219px] left-[153px]"
                      alt="Path"
                      src="/path-21.svg"
                    />
                    <img
                      className="absolute w-[21px] h-[62px] top-[218px] left-[154px]"
                      alt="Path"
                      src="/path-43.svg"
                    />
                    <img
                      className="absolute w-[22px] h-[61px] top-[212px] left-[180px]"
                      alt="Path"
                      src="/path-30.svg"
                    />
                    <img
                      className="absolute w-[98px] h-[98px] top-0 left-1"
                      alt="Group"
                      src="/group-23.png"
                    />
                    <img
                      className="absolute w-[55px] h-[49px] top-[74px] left-[87px]"
                      alt="Path"
                      src="/path-37.svg"
                    />
                    <img
                      className="absolute w-3 h-3 top-16 left-[83px]"
                      alt="Path"
                      src="/path-32.svg"
                    />
                    <img
                      className="absolute w-3 h-3 top-16 left-[83px]"
                      alt="Path"
                      src="/path-40.svg"
                    />
                  </div>

                  {/* Left side character */}
                  <img
                    className="absolute w-[85px] h-[276px] top-[7px] left-0"
                    alt="Group"
                    src="/group-20.png"
                  />
                </div>

                {/* Top document/note */}
                <div className="absolute w-[132px] h-[148px] top-0 left-[43px]">
                  <img
                    className="w-[132px] h-[86px] top-0 absolute left-0"
                    alt="Shape"
                    src="/shape-5.svg"
                  />
                  <img
                    className="absolute w-[50px] h-[86px] top-[62px] left-[39px]"
                    alt="Path"
                    src="/path-28.svg"
                  />
                  <img
                    className="absolute w-[22px] h-[11px] top-[62px] left-[78px]"
                    alt="Path"
                    src="/path-26.svg"
                  />
                  <img
                    className="absolute w-[22px] h-[11px] top-[62px] left-[78px]"
                    alt="Path"
                    src="/path-31.svg"
                  />
                  <img
                    className="absolute w-[18px] h-1.5 top-20 left-[46px]"
                    alt="Path"
                    src="/path-27.svg"
                  />
                  <img
                    className="absolute w-6 h-1.5 top-[91px] left-[46px]"
                    alt="Path"
                    src="/path-27.svg"
                  />
                  <img
                    className="absolute w-5 h-1.5 top-[103px] left-[46px]"
                    alt="Path"
                    src="/path-27.svg"
                  />
                  <img
                    className="absolute w-[26px] h-1.5 top-[114px] left-[46px]"
                    alt="Path"
                    src="/path-27.svg"
                  />
                  <img
                    className="absolute w-[50px] h-[86px] top-[62px] left-[39px]"
                    alt="Path"
                    src="/path-44.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
