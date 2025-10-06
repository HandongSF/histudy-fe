export function maskName(name: string) {
   return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}
