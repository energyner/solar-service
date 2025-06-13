
export function calcularProduccionSolar(req, res) {
    console.log("1.1 - Calculando produccion-solar");

    const { area, irradiacion, eficiencia} = req.body;

    if (isNaN(area) || isNaN(irradiacion) || isNaN(eficiencia)) {
        console.log("1.1.1 - Error: Parámetros inválidos");
        return res.status(400).json({
            error: "Parámetros inválidos: area, irradiacion y eficiencia deben ser números"
        });
    }

    try {
        const resultado = parseFloat(area) * parseFloat(irradiacion)*parseFloat(eficiencia);
        console.log("1.2 - Cálculo resuelto:", resultado);
        res.json({ produccion_solar: resultado });
    } catch (error) {
        console.error("Error al calcular la produccion-solar:", error);
        res.status(500).json({ error: "Error interno al calcular la produccion-solar." });
    }
}
