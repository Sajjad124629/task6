<?php

namespace App\Service;

class TruthTableService
{
    public function generateTruthTable(array $nodes, array $edges): array
    {
        $inputs = [];
        $outputs = [];

        foreach ($nodes as $node) {
            $type = strtolower($node['type'] ?? $node['data']['gateType'] ?? '');
            $label = $node['data']['label'] ?? $node['id'];
            
            if (str_contains($type, 'input') || str_contains($type, 'switch') || str_contains($type, 'button')) {
                $inputs[] = [
                    'id' => $node['id'],
                    'label' => $label
                ];
            } elseif (str_contains($type, 'output') || str_contains($type, 'bulb') || str_contains($type, 'led')) {
                $outputs[] = [
                    'id' => $node['id'],
                    'label' => $label
                ];
            }
        }

        usort($inputs, fn($a, $b) => strcmp($a['label'], $b['label']));
        usort($outputs, fn($a, $b) => strcmp($a['label'], $b['label']));

        $inputCount = count($inputs);
        if ($inputCount === 0) {
            return [
                'headers' => ['Status'],
                'rows' => [['No input components placed in circuit']],
                'inputs' => [],
                'outputs' => []
            ];
        }

        if ($inputCount > 8) {
            return [
                'headers' => ['Warning'],
                'rows' => [['Truth table size too large (>8 inputs)']],
                'inputs' => array_column($inputs, 'label'),
                'outputs' => array_column($outputs, 'label')
            ];
        }

        $combinationsCount = 1 << $inputCount; 
        $rows = [];

        for ($i = 0; $i < $combinationsCount; $i++) {
            $inputStates = [];
            for ($j = 0; $j < $inputCount; $j++) {
                $bit = ($i >> ($inputCount - 1 - $j)) & 1;
                $inputStates[$inputs[$j]['id']] = $bit;
            }

            $outputStates = $this->evaluateCircuit($nodes, $edges, $inputStates);

            $row = [];
            foreach ($inputs as $inp) {
                $row[] = $inputStates[$inp['id']];
            }
            foreach ($outputs as $out) {
                $row[] = $outputStates[$out['id']] ?? 0;
            }

            $rows[] = $row;
        }

        $headers = array_merge(
            array_column($inputs, 'label'),
            array_column($outputs, 'label')
        );

        return [
            'headers' => $headers,
            'rows' => $rows,
            'inputs' => array_column($inputs, 'label'),
            'outputs' => array_column($outputs, 'label')
        ];
    }

    private function evaluateCircuit(array $nodes, array $edges, array $inputStates): array
    {
        $nodeValues = $inputStates;
        $maxPasses = count($nodes) * 2;
        for ($pass = 0; $pass < $maxPasses; $pass++) {
            $changed = false;

            foreach ($nodes as $node) {
                $id = $node['id'];
                $gateType = strtoupper($node['data']['gateType'] ?? $node['type'] ?? '');

                if (isset($inputStates[$id])) {
                    continue;
                }
                $incoming = [];
                foreach ($edges as $edge) {
                    if ($edge['target'] === $id) {
                        $sourceId = $edge['source'];
                        $incoming[] = $nodeValues[$sourceId] ?? 0;
                    }
                }

                $val = $this->computeGateValue($gateType, $incoming);
                if (!isset($nodeValues[$id]) || $nodeValues[$id] !== $val) {
                    $nodeValues[$id] = $val;
                    $changed = true;
                }
            }

            if (!$changed) {
                break;
            }
        }

        return $nodeValues;
    }

    private function computeGateValue(string $gateType, array $inputs): int
    {
        if (empty($inputs)) {
            return 0;
        }

        if (str_contains($gateType, 'NOT')) {
            return ($inputs[0] ?? 0) === 1 ? 0 : 1;
        }

        if (str_contains($gateType, 'AND') && !str_contains($gateType, 'NAND')) {
            foreach ($inputs as $in) {
                if ($in === 0) return 0;
            }
            return 1;
        }

        if (str_contains($gateType, 'NAND')) {
            foreach ($inputs as $in) {
                if ($in === 0) return 1;
            }
            return 0;
        }

        if (str_contains($gateType, 'OR') && !str_contains($gateType, 'NOR') && !str_contains($gateType, 'XOR')) {
            foreach ($inputs as $in) {
                if ($in === 1) return 1;
            }
            return 0;
        }

        if (str_contains($gateType, 'NOR')) {
            foreach ($inputs as $in) {
                if ($in === 1) return 0;
            }
            return 1;
        }

        if (str_contains($gateType, 'XOR')) {
            $ones = 0;
            foreach ($inputs as $in) {
                if ($in === 1) $ones++;
            }
            return ($ones % 2 !== 0) ? 1 : 0;
        }

        return $inputs[0] ?? 0;
    }
}
