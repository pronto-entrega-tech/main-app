declare module "*.ttf" {
  const content: number;
  export default content;
}

declare module "*.woff2" {
  const content: number;
  export default content;
}

declare module "*.png" {
  const content: number;
  export default content;
}

declare module "*.webp" {
  const content: number;
  export default content;
}

interface MapConstructor {
  new <K, V>(iterable?: Iterable<readonly [K, V]>): Map<K, V>;
}
