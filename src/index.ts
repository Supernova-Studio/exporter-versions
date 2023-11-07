import { FileHelper } from "@supernovaio/export-helpers"
import { Supernova, PulsarContext, AnyOutputFile, TokenType, ColorToken } from "@supernovaio/sdk-exporters"
import { ExporterConfiguration } from "../config"
import { indexOfVersions, readableVersion } from "./content/helpers"

/**
 * Export entrypoint.
 * When running `export` through extensions or pipelines, this function will be called.
 * Context contains information about the design system and version that is currently being exported.
 */
Pulsar.export(async (sdk: Supernova, context: PulsarContext): Promise<Array<AnyOutputFile>> => {
  // Get all the versions
  const versions = await sdk.versions.getVersions(context.dsId)
  const readOnlyVersions = versions.filter((v) => v.isReadonly)

  if (exportConfiguration.separateFiles) {
    // Create output file and return it
    const dynamicContent = readOnlyVersions.map((v) => {
      return FileHelper.createTextFile({
        relativePath: "./",
        fileName: `${v.version?.replaceAll(".", "-")}.md`,
        content: readableVersion(v),
      })
    })

    const staticContent = [
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "index.md",
        content: indexOfVersions(readOnlyVersions),
      }),
    ]

    return [...dynamicContent, ...staticContent]
  } else {
    // Create output file and return it
    return [
      FileHelper.createTextFile({
        relativePath: "./",
        fileName: "release-notes.md",
        content: readOnlyVersions.map((v) => readableVersion(v)).join("\n"),
      }),
    ]
  }
})

/** Exporter configuration. Adheres to the `ExporterConfiguration` interface and its content comes from the resolved default configuration + user overrides of various configuration keys */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>()
