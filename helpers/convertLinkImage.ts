//images/item/${image.ImageURL}.avif?w=48&h=48
export function LinkImageConverter(link: string,width : string | number,height:string | number,type: string = "avif"): string {
  return `/images/item/${link}.${type}?w=${width}&h=${height}`;
}