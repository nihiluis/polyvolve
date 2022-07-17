package polyvolve.prototype.api.util;

import polyvolve.prototype.api.data.models.review.value.ReviewCriterionValueScale;

import java.util.stream.Collector;

import static java.util.stream.Collector.Characteristics.UNORDERED;

public class ScoreCollectors {
    /**
     * For use to calculate the variance from a stream.
     *
     * From https://stackoverflow.com/questions/36263352/java-streams-standard-deviation.
     */
    public static final Collector<ReviewCriterionValueScale, double[], Double> VARIANCE_COLLECTOR = Collector.of( // See https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
            () -> new double[3], // {count, mean, M2}
            (acu, d) -> { // See chapter about Welford's online algorithm and https://math.stackexchange.com/questions/198336/how-to-calculate-standard-deviation-with-streaming-inputs
                acu[0]++; // Count
                double delta = d.getValue() - acu[1];
                acu[1] += delta / acu[0]; // Mean
                acu[2] += delta * (d.getValue() - acu[1]); // M2
            },
            (acuA, acuB) -> { // See chapter about "Parallel algorithm" : only called if stream is parallel ...
                double delta = acuB[1] - acuA[1];
                double count = acuA[0] + acuB[0];
                acuA[2] = acuA[2] + acuB[2] + delta * delta * acuA[0] * acuB[0] / count; // M2
                acuA[1] += delta * acuB[0] / count;  // Mean
                acuA[0] = count; // Count
                return acuA;
            },
            acu -> acu[2] / (acu[0] - 1.0), // Var = M2 / (count - 1)
            UNORDERED);
}
