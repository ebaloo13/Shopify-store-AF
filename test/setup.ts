const litGlobal = globalThis as typeof globalThis & {
  litIssuedWarnings?: Set<string>;
};

litGlobal.litIssuedWarnings = new Set(['dev-mode']);
