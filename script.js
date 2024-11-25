// Taxas
const taxaYelly = [
    // Basic
    [0, 3.20, 4.53, 5.05, 5.57, 6.08, 6.59, 7.65, 8.14, 8.65, 9.14, 9.63, 10.12, 10.61, 11.09, 11.56, 12.04, 12.51, 12.98],
    // Max
    [0, 2.96, 3.92, 4.47, 5.01, 5.56, 6.09, 6.67, 7.20, 7.72, 8.24, 8.76, 9.28, 9.78, 10.29, 10.79, 11.28, 12.78, 12.27],
    // Flash
    [0, 3.51, 4.31, 4.90, 5.49, 6.08, 6.66, 7.74, 8.31, 8.88, 9.45, 10.00, 10.55, 11.11, 11.65, 12.19, 12.72, 13.26, 13.79]
];

const taxaConcorrente = [
    // Basic, Max, Flash (same rates for all)
    [0, 4.74, 6.56, 7.52, 8.46, 9.42, 10.37, 11.39, 12.32, 13.23, 14.14, 15.07, 15.95, 16.82, 17.73, 18.61, 19.47, 20.34, 21.18],
    [0, 4.74, 6.56, 7.52, 8.46, 9.42, 10.37, 11.39, 12.32, 13.23, 14.14, 15.07, 15.95, 16.82, 17.73, 18.61, 19.47, 20.34, 21.18],
    [0, 4.74, 6.56, 7.52, 8.46, 9.42, 10.37, 11.39, 12.32, 13.23, 14.14, 15.07, 15.95, 16.82, 17.73, 18.61, 19.47, 20.34, 21.18]
];

// Estado inicial
let estado = {
    faturamento: 1000,
    parcelas: 12,
    recebimento: 1 // 0: Basic, 1: Max, 2: Flash
};

// Formatadores
const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

const formatarNumero = (numero) => {
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// Conversor de string de moeda para número
const converterMoedaParaNumero = (valor) => {
    if (!valor) return 0;
    return Number(valor.replace(/[^0-9,]/g, '').replace(',', '.'));
};

// Cálculos
const calcularValorFinal = (valor, taxa) => {
    return valor * (1 - (taxa / 100));
};

const atualizarCalculos = () => {
    // Taxas
    const taxaYellyAtual = taxaYelly[estado.recebimento][estado.parcelas];
    const taxaConcorrenteAtual = taxaConcorrente[estado.recebimento][estado.parcelas];

    // Valores
    const valorYelly = calcularValorFinal(estado.faturamento, taxaYellyAtual);
    const valorConcorrente = calcularValorFinal(estado.faturamento, taxaConcorrenteAtual);
    const economia = valorYelly - valorConcorrente;
    const economiaAnual = economia * 12;

    // Atualizar interface
    document.getElementById('taxaYellyFinal').textContent = formatarNumero(taxaYellyAtual);
    document.getElementById('taxaConcorrenteFinal').textContent = formatarNumero(taxaConcorrenteAtual);
    document.getElementById('valorYellyFinal').textContent = formatarMoeda(valorYelly);
    document.getElementById('valorConcorrenteFinal').textContent = formatarMoeda(valorConcorrente);
    document.getElementById('economiaYellyFinal').textContent = formatarMoeda(economia);
    document.getElementById('concorrentePerderiaFinal').textContent = formatarMoeda(economiaAnual);
};

// Event Listeners
document.getElementById('faturamento').addEventListener('input', (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    const valorFormatado = (valor / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    e.target.value = valorFormatado;
    estado.faturamento = converterMoedaParaNumero(valorFormatado);
    atualizarCalculos();
});

document.getElementById('parcelas').addEventListener('change', (e) => {
    estado.parcelas = parseInt(e.target.value);
    atualizarCalculos();
});

document.querySelectorAll('.plan-option').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelector('.plan-option.selected').classList.remove('selected');
        e.target.classList.add('selected');
        estado.recebimento = parseInt(e.target.dataset.plan);
        atualizarCalculos();
    });
});

// Inicialização
atualizarCalculos();