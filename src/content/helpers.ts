import { DesignSystemVersion } from "@supernovaio/sdk-exporters"

export function readableVersion(version: DesignSystemVersion): string {
  return `
# ${version.name} (${version.version})
${version.changeLog}
    `
}

export function indexOfVersions(versions: Array<DesignSystemVersion>): string {
  return `
# Release notes

${versions.map((v) => `- [${v.name} (${v.version})](./${v.version?.replaceAll(".", "-")}.md)`).join("\n")}
`
}
