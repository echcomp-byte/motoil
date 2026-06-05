import SwiftUI
import WidgetKit

// Brand red per HANDOFF.md §B + widget-ui.md §6.
// #E53935 = rgb(229,57,53). On iOS 16 lock screen this is forced to a
// monochrome tint by the system; the badge degrades to a white-stroked
// rect, which §6's contrast table covers.
private let brandRed = Color(red: 229.0 / 255.0, green: 57.0 / 255.0, blue: 53.0 / 255.0)

private let openDeepLink = URL(string: "motoil://ice")
private let openAppDeepLink = URL(string: "motoil://")

struct IceWidgetView: View {
    let entry: IceEntry

    // iOS 17 introduced .containerBackground(for: .widget) {} to opt into
    // edge-to-edge content. We don't call it here so iOS 16 stays
    // compatible — iOS 17 simply applies its system-default container
    // background. Worth revisiting once iOS 16 drops out of support.
    var body: some View {
        Group {
            switch entry.state {
            case .ready(let snapshot):
                ReadyView(snapshot: snapshot)
                    .widgetURL(openDeepLink)
            case .empty, .stale, .corrupt:
                PlaceholderView(
                    primary: "פתח את MotoIL לעדכון",
                    secondary: "Open MotoIL to update"
                )
                .widgetURL(openAppDeepLink)
            case .locked:
                PlaceholderView(
                    primary: "בטל נעילה פעם אחת לאחר הפעלה",
                    secondary: "Unlock once after reboot"
                )
                .widgetURL(openAppDeepLink)
            }
        }
    }
}

// Minimal accessoryRectangular-tuned layout per widget-ui.md §3.
// Other families (Circular, Inline, systemSmall/Medium) share this
// layout in v1; family-specific tuning lands in a follow-up once
// real-device contrast verification (§6 DoD) is complete.
private struct ReadyView: View {
    let snapshot: IceSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("MotoIL ICE")
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(.secondary)

            HStack(spacing: 6) {
                BloodTypeBadge(value: snapshot.profile.bloodType)
                Text(snapshot.profile.fullName)
                    .font(.system(size: 13, weight: .semibold))
                    .lineLimit(1)
                    .truncationMode(.tail)
            }

            if let contact = snapshot.emergencyContacts.first {
                HStack(spacing: 4) {
                    Image(systemName: "phone.fill")
                        .font(.system(size: 10))
                    Text(contact.phone)
                        .font(.system(size: 11))
                        .environment(\.layoutDirection, .leftToRight)
                    if let relation = contact.relation {
                        Text("(\(relation))")
                            .font(.system(size: 11))
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                }
            }
        }
    }
}

private struct BloodTypeBadge: View {
    let value: String?

    var body: some View {
        if let v = value {
            Text(v)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, 4)
                .padding(.vertical, 1)
                .background(brandRed)
                .clipShape(RoundedRectangle(cornerRadius: 4))
        } else {
            Image(systemName: "drop.fill")
                .font(.system(size: 12))
                .foregroundStyle(brandRed)
        }
    }
}

private struct PlaceholderView: View {
    let primary: String
    let secondary: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("MotoIL ICE")
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(.secondary)
            Text(primary)
                .font(.system(size: 12, weight: .medium))
                .lineLimit(1)
                .truncationMode(.tail)
            Text(secondary)
                .font(.system(size: 10))
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .environment(\.layoutDirection, .leftToRight)
        }
    }
}
