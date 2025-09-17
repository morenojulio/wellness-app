<script lang="ts">
    import { onMount } from "svelte";
    import { journalStore } from "$lib/stores/journal";

    onMount(() => {
        journalStore.init();
    });

    function formatDate(timestamp: any) {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
        return "Fecha no disponible";
    }

    function getEnergyColor(energy: number) {
        if (energy >= 8) return "text-green-600 dark:text-green-400";
        if (energy >= 6) return "text-yellow-600 dark:text-yellow-400";
        if (energy >= 4) return "text-orange-600 dark:text-orange-400";
        return "text-red-600 dark:text-red-400";
    }

    function getEnergyBg(energy: number) {
        if (energy >= 8) return "bg-green-100 dark:bg-green-900";
        if (energy >= 6) return "bg-yellow-100 dark:bg-yellow-900";
        if (energy >= 4) return "bg-orange-100 dark:bg-orange-900";
        return "bg-red-100 dark:bg-red-900";
    }
</script>

<div class="font-serif p-2 sm:p-5">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1
                class="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-gray-100 text-center border-b-2 border-blue-500 pb-3"
            >
                📊 Resultados del Diario
            </h1>
            <p class="text-center text-gray-600 dark:text-gray-300 mt-4">
                Revisa tus entradas pasadas y observa tus patrones
            </p>
        </div>

        {#if $journalStore.isLoading}
            <div class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                ></div>
                <p class="mt-4 text-gray-600 dark:text-gray-300">
                    Cargando entradas...
                </p>
            </div>
        {:else if $journalStore.error}
            <div
                class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg"
            >
                <strong>Error:</strong>
                {$journalStore.error}
            </div>
        {:else if $journalStore.entries.length === 0}
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <h2
                    class="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2"
                >
                    No hay entradas aún
                </h2>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                    Comienza escribiendo tu primera entrada del diario
                </p>
                <a
                    href="/"
                    class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
                >
                    Escribir Primera Entrada
                </a>
            </div>
        {:else}
            <!-- Entries List -->
            <div class="space-y-6">
                {#each $journalStore.entries as entry (entry.id)}
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                    >
                        <!-- Entry Header -->
                        <div
                            class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6"
                        >
                            <h2
                                class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-0"
                            >
                                {formatDate(entry.timestamp)}
                            </h2>

                            <!-- Energy Levels Summary -->
                            <div class="flex space-x-4 text-sm">
                                <div class="flex items-center space-x-1">
                                    <span class="text-orange-500">🌅</span>
                                    <span
                                        class="px-2 py-1 rounded-full {getEnergyBg(
                                            entry.morningEnergy,
                                        )} {getEnergyColor(
                                            entry.morningEnergy,
                                        )} font-medium"
                                    >
                                        {entry.morningEnergy}/10
                                    </span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <span class="text-red-500">☀️</span>
                                    <span
                                        class="px-2 py-1 rounded-full {getEnergyBg(
                                            entry.afternoonEnergy,
                                        )} {getEnergyColor(
                                            entry.afternoonEnergy,
                                        )} font-medium"
                                    >
                                        {entry.afternoonEnergy}/10
                                    </span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <span class="text-purple-500">🌙</span>
                                    <span
                                        class="px-2 py-1 rounded-full {getEnergyBg(
                                            entry.eveningEnergy,
                                        )} {getEnergyColor(
                                            entry.eveningEnergy,
                                        )} font-medium"
                                    >
                                        {entry.eveningEnergy}/10
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Entry Content -->
                        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <!-- Morning Section -->
                            <div class="space-y-4">
                                <h3
                                    class="text-lg font-semibold text-orange-500 border-b border-orange-200 dark:border-orange-800 pb-1"
                                >
                                    🌅 Mañana
                                </h3>
                                {#if entry.morningFocus}
                                    <div>
                                        <h4
                                            class="font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Enfoque del día:
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                        >
                                            {entry.morningFocus}
                                        </p>
                                    </div>
                                {/if}
                            </div>

                            <!-- Afternoon Section -->
                            <div class="space-y-4">
                                <h3
                                    class="text-lg font-semibold text-red-500 border-b border-red-200 dark:border-red-800 pb-1"
                                >
                                    ☀️ Tarde
                                </h3>
                                {#if entry.afternoonMoment}
                                    <div>
                                        <h4
                                            class="font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Momento auténtico:
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                        >
                                            {entry.afternoonMoment}
                                        </p>
                                    </div>
                                {/if}
                            </div>

                            <!-- Evening Section -->
                            <div class="space-y-4 md:col-span-2 lg:col-span-1">
                                <h3
                                    class="text-lg font-semibold text-purple-500 border-b border-purple-200 dark:border-purple-800 pb-1"
                                >
                                    🌙 Noche
                                </h3>

                                {#if entry.eveningEmotion}
                                    <div>
                                        <h4
                                            class="font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Emoción principal:
                                        </h4>
                                        <p
                                            class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                        >
                                            {entry.eveningEmotion}
                                        </p>
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <!-- Evening Reflections -->
                        {#if entry.eveningAuthentic || entry.eveningActing || entry.eveningAdmiration}
                            <div
                                class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                            >
                                <h3
                                    class="text-lg font-semibold text-purple-500 mb-4"
                                >
                                    Reflexiones de la noche
                                </h3>
                                <div
                                    class="grid gap-4 md:grid-cols-1 lg:grid-cols-3"
                                >
                                    {#if entry.eveningAuthentic}
                                        <div>
                                            <h4
                                                class="font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Momento auténtico:
                                            </h4>
                                            <p
                                                class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                            >
                                                {entry.eveningAuthentic}
                                            </p>
                                        </div>
                                    {/if}

                                    {#if entry.eveningActing}
                                        <div>
                                            <h4
                                                class="font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Actuando/Encajando:
                                            </h4>
                                            <p
                                                class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                            >
                                                {entry.eveningActing}
                                            </p>
                                        </div>
                                    {/if}

                                    {#if entry.eveningAdmiration}
                                        <div>
                                            <h4
                                                class="font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Admiración/Cualidad:
                                            </h4>
                                            <p
                                                class="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                            >
                                                {entry.eveningAdmiration}
                                            </p>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
