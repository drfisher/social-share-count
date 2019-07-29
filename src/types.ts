export interface IKeyValue {
  [s: string]: string | number;
}

export interface ISocialNetworkConfig {
  getCount?: (data: any) => number;
  params: {
    url: string;
    id?: string;
  };
  url: string;
}

export interface ISocialNetworkConfigLib {
  [s: string]: ISocialNetworkConfig;
}

export interface IGetCountParams {
  url: string;
  networkName: "facebook" | "vk" | "ok";
}
