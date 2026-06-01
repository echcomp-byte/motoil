import SwiftUI
import WidgetKit

struct MotoILWidget: Widget {
    let kind: String = "MotoILWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: IceProvider()) { entry in
            IceWidgetView(entry: entry)
        }
        .configurationDisplayName("MotoIL ICE")
        .description("Emergency contact and medical info, visible without unlock.")
        .supportedFamilies([
            .accessoryRectangular,
            .accessoryCircular,
            .accessoryInline,
            .systemSmall,
            .systemMedium,
        ])
        // .contentMarginsDisabled() is iOS 17+ — skipping so iOS 16 stays in.
    }
}
