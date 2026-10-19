"""Dummy camera helper: picks the best resolution a camera supports."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Resolution:
    width: int
    height: int

    @property
    def pixels(self) -> int:
        return self.width * self.height


def best_resolution(supported: list[Resolution], max_pixels: int) -> Resolution | None:
    """Return the largest resolution that fits within max_pixels, or None."""
    fitting = [r for r in supported if r.pixels <= max_pixels]
    return max(fitting, key=lambda r: r.pixels, default=None)


if __name__ == "__main__":
    modes = [Resolution(640, 480), Resolution(1280, 720), Resolution(1920, 1080)]
    print(best_resolution(modes, max_pixels=1_000_000))
