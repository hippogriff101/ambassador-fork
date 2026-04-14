"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslations } from "next-intl";

type WarehouseStatsData = {
  expenditure: {
    contents: number;
    labor: number;
    postage: number;
    total: number;
  };
  completedOrders: number;
};

type PieSlice = {
  name: string;
  value: number;
  fill: string;
};

export function WarehouseStats({ locale }: { locale: string }) {
  const t = useTranslations("admin.orders.warehouse");
  const [data, setData] = useState<WarehouseStatsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/warehouse-stats")
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<unknown>;
      })
      .then((result) => {
        if (
          typeof result === "object" &&
          result !== null &&
          "expenditure" in result &&
          typeof result.expenditure === "object" &&
          result.expenditure !== null &&
          "contents" in result.expenditure &&
          typeof result.expenditure.contents === "number" &&
          "labor" in result.expenditure &&
          typeof result.expenditure.labor === "number" &&
          "postage" in result.expenditure &&
          typeof result.expenditure.postage === "number" &&
          "total" in result.expenditure &&
          typeof result.expenditure.total === "number" &&
          "completedOrders" in result &&
          typeof result.completedOrders === "number"
        ) {
          setData({
            expenditure: {
              contents: result.expenditure.contents,
              labor: result.expenditure.labor,
              postage: result.expenditure.postage,
              total: result.expenditure.total,
            },
            completedOrders: result.completedOrders,
          });
        }
      })
      .catch(() => setData(null));
  }, []);

  const currencyFmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  if (data === null) {
    return <p className="font-body text-sm text-white/50">{t("crunching")}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex flex-col gap-3">
          {/* Shirt stock block temporarily hidden. */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-body text-sm text-secondary">{t("expenditure-label")}</p>
              <p className="text-2xl text-white">{currencyFmt.format(data.expenditure.total)}</p>
            </div>
            <div className="space-y-1 font-body text-sm text-white">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: "var(--chart-applications)" }} />
                <span>{t("contents")}</span>
                <span className="ml-auto">{currencyFmt.format(data.expenditure.contents)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: "var(--chart-signups)" }} />
                <span>{t("labor")}</span>
                <span className="ml-auto">{currencyFmt.format(data.expenditure.labor)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: "var(--chart-approved)" }} />
                <span>{t("postage")}</span>
                <span className="ml-auto">{currencyFmt.format(data.expenditure.postage)}</span>
              </div>
            </div>
            <p className="font-body text-xs text-white/50">
              {t("completed-orders", { count: data.completedOrders })}
            </p>
          </div>
        </div>

        <div className="h-48 min-w-0">
          <ExpenditurePie
            data={[
              { name: t("contents"), value: data.expenditure.contents, fill: "var(--chart-applications)" },
              { name: t("labor"), value: data.expenditure.labor, fill: "var(--chart-signups)" },
              { name: t("postage"), value: data.expenditure.postage, fill: "var(--chart-approved)" },
            ]}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}

function ExpenditurePie({ data, locale }: { data: PieSlice[]; locale: string }) {
  const nonZero = data.filter((d) => d.value > 0);

  if (nonZero.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <PieChart>
        <Pie
          data={nonZero}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          strokeWidth={0}
        >
          {nonZero.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          content={
            <PieTooltip locale={locale} />
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function PieTooltip({
  active,
  payload,
  locale,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    payload?: { fill?: string };
  }>;
  locale: string;
}) {
  if (active !== true || payload === undefined || payload.length === 0) return null;

  const currencyFmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <div className="rounded-xl border border-white bg-black px-4 py-3">
      <div className="space-y-2">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-body text-sm text-white">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.payload?.fill ?? "var(--foreground)" }}
              />
              <span>{item.name}</span>
            </div>
            <span className="font-body text-sm text-white">
              {currencyFmt.format(Number(item.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
