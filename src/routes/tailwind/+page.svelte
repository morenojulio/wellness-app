<script lang="ts">
    let currentDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Energy levels for each time period
    let morningEnergy = 0;
    let afternoonEnergy = 0;
    let eveningEnergy = 0;

    // Journal responses
    let morningFocus = "";
    let afternoonMoment = "";
    let eveningEmotion = "";
    let eveningAuthentic = "";
    let eveningActing = "";
    let eveningAdmiration = "";

    function selectEnergy(
        period: "morning" | "afternoon" | "evening",
        value: number,
    ) {
        if (period === "morning") morningEnergy = value;
        if (period === "afternoon") afternoonEnergy = value;
        if (period === "evening") eveningEnergy = value;
    }
</script>

<div class="min-h-screen bg-gray-50 p-2 sm:p-5">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <!-- Header -->
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 text-center border-b-2 border-blue-500 pb-3 mb-8">
            🌱 Diario Diario para Conocerte Mejor
        </h1>

        <!-- Date Section -->
        <div class="text-center text-lg text-gray-600 mb-8 font-medium">
            <strong>Fecha:</strong>
            {currentDate}
        </div>

        <!-- MORNING SECTION -->
        <div class="border-2 border-gray-200 border-l-orange-500 border-l-8 rounded-lg p-5 mb-8">
            <div class="text-xl font-bold text-orange-500 mb-4">🌅 Mañana (2 minutos)</div>

            <!-- Morning Energy Question -->
            <div class="mb-6">
                <div class="font-bold text-slate-700 mb-2">¿Cómo está mi energía ahorita?</div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Encierra un número del 1 (súper cansado) al 10 (lleno de energía)
                </div>

                <!-- Energy Scale - Mobile First -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <span class="text-center sm:text-left text-sm font-medium text-gray-700">Poca Energía</span>
                    <div class="flex flex-wrap justify-center gap-2 flex-1">
                        {#each Array(10) as _, i}
                            <button
                                class="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 {morningEnergy === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700'}"
                                on:click={() => selectEnergy("morning", i + 1)}
                            >
                                {i + 1}
                            </button>
                        {/each}
                    </div>
                    <span class="text-center sm:text-right text-sm font-medium text-gray-700">Mucha Energía</span>
                </div>
            </div>

            <!-- Morning Focus Question -->
            <div class="mb-4">
                <div class="font-bold text-slate-700 mb-2">
                    ¿Qué es una cosa sobre mí mismo que quiero notar hoy?
                </div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Solo una cosa simple - como "ver cuándo sonrío natural" o "notar si estoy forzando pláticas"
                </div>
                <textarea
                    class="w-full min-h-[80px] border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    bind:value={morningFocus}
                    placeholder="Escribe aquí..."
                ></textarea>
            </div>
        </div>

        <!-- AFTERNOON SECTION -->
        <div class="border-2 border-gray-200 border-l-red-500 border-l-8 rounded-lg p-5 mb-8">
            <div class="text-xl font-bold text-red-500 mb-4">☀️ Tarde (2 minutos)</div>

            <!-- Afternoon Energy Question -->
            <div class="mb-6">
                <div class="font-bold text-slate-700 mb-2">¿Cómo está mi energía ahorita?</div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Encierra un número del 1 (súper cansado) al 10 (lleno de energía)
                </div>

                <!-- Energy Scale -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <span class="text-center sm:text-left text-sm font-medium text-gray-700">Poca Energía</span>
                    <div class="flex flex-wrap justify-center gap-2 flex-1">
                        {#each Array(10) as _, i}
                            <button
                                class="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 {afternoonEnergy === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700'}"
                                on:click={() => selectEnergy("afternoon", i + 1)}
                            >
                                {i + 1}
                            </button>
                        {/each}
                    </div>
                    <span class="text-center sm:text-right text-sm font-medium text-gray-700">Mucha Energía</span>
                </div>
            </div>

            <!-- Afternoon Moment Question -->
            <div class="mb-4">
                <div class="font-bold text-slate-700 mb-2">
                    ¿En qué momento de hoy me he sentido más como yo mismo?
                </div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Piensa en un momento, aunque sea pequeño, donde te sentiste natural y relajado
                </div>
                <textarea
                    class="w-full min-h-[80px] border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    bind:value={afternoonMoment}
                    placeholder="Escribe aquí..."
                ></textarea>
            </div>
        </div>

        <!-- EVENING SECTION -->
        <div class="border-2 border-gray-200 border-l-purple-500 border-l-8 rounded-lg p-5 mb-8">
            <div class="text-xl font-bold text-purple-500 mb-4">🌙 Noche (5 minutos)</div>

            <!-- Evening Energy Question -->
            <div class="mb-6">
                <div class="font-bold text-slate-700 mb-2">¿Cómo está mi energía ahorita?</div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Encierra un número del 1 (súper cansado) al 10 (lleno de energía)
                </div>

                <!-- Energy Scale -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <span class="text-center sm:text-left text-sm font-medium text-gray-700">Poca Energía</span>
                    <div class="flex flex-wrap justify-center gap-2 flex-1">
                        {#each Array(10) as _, i}
                            <button
                                class="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 {eveningEnergy === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700'}"
                                on:click={() => selectEnergy("evening", i + 1)}
                            >
                                {i + 1}
                            </button>
                        {/each}
                    </div>
                    <span class="text-center sm:text-right text-sm font-medium text-gray-700">Mucha Energía</span>
                </div>
            </div>

            <!-- Evening Emotion Question -->
            <div class="mb-6">
                <div class="font-bold text-slate-700 mb-2">¿Qué emoción sentí más fuerte hoy?</div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Solo ponle nombre - "frustrado," "curioso," "ansioso," "emocionado," etc. No necesitas analizarlo
                </div>
                <textarea
                    class="w-full min-h-[80px] border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    bind:value={eveningEmotion}
                    placeholder="Escribe aquí..."
                ></textarea>
            </div>

            <!-- Evening Authentic Question -->
            <div class="mb-6">
                <div class="font-bold text-slate-700 mb-2">
                    ¿Cuándo me sentí más como yo mismo hoy?
                </div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Describe cómo se sintió por dentro cuando estabas siendo genuinamente tú
                </div>
                <textarea
                    class="w-full min-h-[100px] border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    bind:value={eveningAuthentic}
                    placeholder="Escribe aquí..."
                ></textarea>
            </div>

            <!-- Evening Acting Question -->
            <div class="mb-6">
                <div class="font-bold text-slate-700 mb-2">
                    ¿Cuándo sentí que estaba actuando o tratando de encajar?
                </div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Describe cómo se sintió por dentro - ¿tenso, cuidadoso, como actuando?
                </div>
                <textarea
                    class="w-full min-h-[100px] border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    bind:value={eveningActing}
                    placeholder="Escribe aquí..."
                ></textarea>
            </div>

            <!-- Evening Admiration Question -->
            <div class="mb-4">
                <div class="font-bold text-slate-700 mb-2">
                    ¿Admiré a alguien hoy? ¿Qué cualidad vi en esa persona que yo ya puedo tener?
                </div>
                <div class="text-gray-600 italic text-sm mb-3">
                    Piensa: "¿Qué me gustó de esa persona, y cómo esa cualidad ya puede existir en mí?"
                </div>
                <textarea
                    class="w-full min-h-[100px] border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    bind:value={eveningAdmiration}
                    placeholder="Escribe aquí..."
                ></textarea>
            </div>
        </div>
    </div>
</div>
