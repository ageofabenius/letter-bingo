import argparse
import ast

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


def main(input_csv: str, output_path: str | None):
    df = pd.read_csv(input_csv)

    curves = np.array(df["num_words_curve"].apply(ast.literal_eval).tolist())

    # Avoid log(0)
    curves = np.maximum(curves, 1)

    x = np.arange(curves.shape[1])

    mean = curves.mean(axis=0)
    median = np.median(curves, axis=0)
    p25 = np.percentile(curves, 25, axis=0)
    p75 = np.percentile(curves, 75, axis=0)

    plt.figure(figsize=(10, 6))

    # Individual runs (faint)
    for c in curves:
        plt.plot(x, c, color="gray", alpha=0.3)

    # Stats
    plt.plot(x, mean, label="Mean", linewidth=2)
    plt.plot(x, median, label="Median", linewidth=2)
    plt.fill_between(x, p25, p75, alpha=0.2, label="25–75%")

    plt.xlabel("Letter index (i)")
    plt.ylabel("W_i")
    plt.title("Difficulty Curves (W_i)")
    plt.yscale("log")

    plt.legend()
    plt.grid(True, which="both", linestyle="--", alpha=0.4)

    if output_path:
        plt.savefig(output_path, dpi=150, bbox_inches="tight")
        print(f"Saved plot to {output_path}")
    else:
        plt.show()

    plt.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Plot W_i difficulty curves from a CSV file"
    )
    parser.add_argument(
        "input", help="Path to CSV file containing num_words_curve column"
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Output image file (e.g. plot.png). If omitted, shows interactively.",
    )

    args = parser.parse_args()
    main(args.input, args.output)
