
export function ZodErrors({ error }:any) {
    if (!error) return null;
    return error.map((err:any, index:any) => (
      <div key={index} className="text-danger">
        {err}
      </div>
    ));
  }
