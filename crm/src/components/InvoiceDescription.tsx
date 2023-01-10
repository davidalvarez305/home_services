export default function InvoiceDescription({ dueDate }: { dueDate: number }) {
    const DUE_DATE = new Date(dueDate);
    const CURRENT_MONTH = DUE_DATE.toLocaleString('default', { month: 'long' });
    const CURRENT_YEAR = DUE_DATE.getFullYear();
  const END_OF_MONTH = new Date(DUE_DATE.getFullYear(), DUE_DATE.getMonth() + 1, 0);
  return <p className="text-gray-500">{`Leads generated from ${CURRENT_MONTH} 1 through ${CURRENT_MONTH} ${END_OF_MONTH.getDate()}, ${CURRENT_YEAR}`}</p>;
}
